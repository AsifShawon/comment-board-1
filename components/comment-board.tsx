"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import boatAnimation from "@/components/boat.json";
import { supabase } from "@/lib/supabase";
import { preloadEmojiAnimations } from "@/lib/emojiHelpers";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Define the Comment interface
interface Comment {
  id: string;
  name: string;
  comment: string;
  emoji: number;
  created_at: string;
}

// Main Comment Board Component
const CommentBoard = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [emojiAnimations, setEmojiAnimations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const maxDisplayComments = 12;

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase
          .from("comments")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(maxDisplayComments);
        if (data) {
          setComments(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, []);

  // Preload emoji animations
  useEffect(() => {
    const loadEmojiAnimations = async () => {
      const animations = await preloadEmojiAnimations();
      setEmojiAnimations(animations);
    };
    loadEmojiAnimations();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("public:comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
        },
        (payload) => {
          const newComment = payload.new as Comment;
          setComments((prevComments) => {
            return [newComment, ...prevComments].slice(0, maxDisplayComments);
          });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="relative w-full h-screen overflow-hidden">
          {/* Sunset Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-red-500 to-purple-900" />
          {/* Sun */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-yellow-200 blur-sm" />
          {/* Ocean */}
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-teal-400 to-blue-900">
            {/* Wave SVG */}
            <div className="absolute bottom-1/2 w-full">
              <svg viewBox="0 0 1440 320" className="w-full">
                <path
                  fill="rgb(15 23 42)"
                  d="M0,320L48,304C96,288,192,256,288,245.3C384,235,480,245,576,234.7C672,224,768,192,864,186.7C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </svg>
            </div>
          </div>
          {/* Comments as Boats */}
          <div className="relative w-full h-full pt-[350px]">
            {typeof window !== "undefined" && (
              <AnimatePresence>
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ x: "100vw", y: `${50 + index * 15}%` }}
                    animate={{ x: "-100vw", y: `${50 + index * 15}%` }}
                    exit={{ opacity: 0 }}
                    transition={{
                      x: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 2,
                      },
                    }}
                    className="absolute"
                  >
                    <div className="relative">
                      {/* Boat Animation */}
                      <div className="absolute -left-4 -top-20 w-[200px]">
                        <Lottie
                          animationData={boatAnimation}
                          loop
                          autoplay
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      {/* Comment Card */}
                      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg w-64 relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            <h3 className="font-semibold text-gray-800">{comment.name}</h3>
                          </div>
                          {/* Display animated emoji or fallback static emoji */}
                          {emojiAnimations[comment.emoji] ? (
                            <Lottie
                              animationData={emojiAnimations[comment.emoji]}
                              loop
                              autoplay
                              style={{ width: 32, height: 32 }}
                            />
                          ) : (
                            <span className="text-xl">😄</span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{comment.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CommentBoard;