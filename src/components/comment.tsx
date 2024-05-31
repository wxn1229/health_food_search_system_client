"use client";
import { Label } from "@/components/ui/label";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Slider, Button, Textarea } from "@nextui-org/react";
import {
  FilePenLine,
  MessageSquare,
  MessageSquareText,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { default as axios } from "@/utils/axios";
import { useAuth } from "@/utils/AuthContext";

interface CommentProps {
  id: string;
}

interface User {
  Name: string;
}

interface Comment {
  content: string;
  modifyTime: string;
  point: number;
  User: User;
}

export function Comment({ id }: CommentProps) {
  const [commentData, setCommentData] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [score, setScore] = useState<number | number[]>(0);
  const { user } = useAuth();
  const [reload, setReload] = useState(true);
  const [isComment, setIsComment] = useState(false);
  const [curCommentNum, setCurCommentNum] = useState(0);
  const [curCommentScore, setCurCommentScore] = useState(0.0);

  useEffect(() => {
    async function getCurCommentData() {
      try {
        const curCommentData = await axios.post(
          "/api/searching/getCommentDataById",
          {
            hfId: id,
          }
        );
        console.log("🚀 ~ getCurCommentData ~ curCommentData:", curCommentData);

        setCurCommentNum(curCommentData.data.result.CurCommentNum);
        setCurCommentScore(curCommentData.data.result.CurPoint);
      } catch (error) {
        console.log("🚀 ~ getCurCommentData ~ error:", error);
      }
    }

    async function getComments() {
      try {
        const comments = await axios.post("/api/user/getComments", {
          hfId: id,
        });
        // console.log("🚀 ~ getComments ~ comments:", comments);
        setCommentData(comments.data.comments);
      } catch (error) {
        console.log("🚀 ~ getComments ~ error:", error);
      }
    }

    async function getIsComment() {
      try {
        const isComment = await axios.post(
          "/api/user/isComment",
          {
            hfId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            },
          }
        );
        // console.log("🚀 ~ getIsComment ~ isComment:", isComment);
        setContent(isComment.data.isComment.content);
        setScore(isComment.data.isComment.point);
        setIsComment(true);
      } catch (error) {
        console.log("🚀 ~ getIsComment ~ error:", error);
      }
    }

    getComments();
    getIsComment();
    getCurCommentData();
  }, [reload]);

  async function submitHandler() {
    try {
      const submit = await axios.post(
        "api/user/submitComment",
        {
          content: content,
          hfId: id,
          modifyTime: new Date().toISOString(),
          score: score,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );

      setReload(!reload);
    } catch (error) {
      console.log("🚀 ~ submitHandler ~ error:", error);
    }
  }

  useEffect(() => {
    // console.log("🚀 ~ Comment ~ content:", content);
    // console.log("🚀 ~ Comment ~ score:", score);
  }, [content, score]);
  const getTimeDifference = (isoTime: string): string => {
    const currentTime = new Date();
    const commentTime = new Date(isoTime);
    const differenceInSeconds = Math.floor(
      (currentTime.getTime() - commentTime.getTime()) / 1000
    );

    const minutes = 60;
    const hours = minutes * 60;
    const days = hours * 24;
    const weeks = days * 7;
    const months = days * 30; // 近似值
    const years = days * 365; // 近似值

    if (differenceInSeconds < minutes) {
      return `${differenceInSeconds} 秒前`;
    } else if (differenceInSeconds < hours) {
      const diffInMinutes = Math.floor(differenceInSeconds / minutes);
      return `${diffInMinutes} 分鐘前`;
    } else if (differenceInSeconds < days) {
      const diffInHours = Math.floor(differenceInSeconds / hours);
      return `${diffInHours} 小時前`;
    } else if (differenceInSeconds < weeks) {
      const diffInDays = Math.floor(differenceInSeconds / days);
      return `${diffInDays} 天前`;
    } else if (differenceInSeconds < months) {
      const diffInWeeks = Math.floor(differenceInSeconds / weeks);
      return `${diffInWeeks} 周前`;
    } else if (differenceInSeconds < years) {
      const diffInMonths = Math.floor(differenceInSeconds / months);
      return `${diffInMonths} 個月前`;
    } else {
      const diffInYears = Math.floor(differenceInSeconds / years);
      return `${diffInYears} 年前`;
    }
  };

  return (
    <div className="mx-10 max-w-2xl space-y-8 py-8 w-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">User Comment</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Share your thoughts and comment with us.
        </p>
      </div>

      <form className="grid gap-4">
        {user.isAuth ? (
          isComment ? (
            <Textarea
              isDisabled
              className="min-h-[120px]"
              placeholder="Write your feedback here..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          ) : (
            <Textarea
              className="min-h-[120px]"
              placeholder="Write your feedback here..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          )
        ) : (
          <Textarea
            isDisabled
            className="min-h-[120px]"
            placeholder="Please log in first before commenting"
          />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 pr-20">
            {user.isAuth ? (
              isComment ? (
                <Slider
                  isDisabled
                  size="sm"
                  step={1}
                  color="primary"
                  label="Score"
                  showSteps={true}
                  maxValue={5}
                  minValue={0}
                  value={score}
                  onChange={(e) => {
                    setScore(e);
                  }}
                  className="max-w-md"
                />
              ) : (
                <Slider
                  size="sm"
                  step={1}
                  color="primary"
                  label="Score"
                  showSteps={true}
                  maxValue={5}
                  minValue={0}
                  value={score}
                  onChange={(e) => {
                    setScore(e);
                  }}
                  className="max-w-md"
                />
              )
            ) : (
              <Slider
                isDisabled
                size="sm"
                step={1}
                color="primary"
                label="Score"
                showSteps={true}
                maxValue={5}
                minValue={0}
                value={score}
                onChange={(e) => {
                  setScore(e);
                }}
                className="max-w-md"
              />
            )}
          </div>
          {user.isAuth ? (
            isComment ? (
              <Button
                variant="ghost"
                color="success"
                startContent={<FilePenLine />}
                onClick={() => {
                  setIsComment(false);
                }}
              >
                edit Comment
              </Button>
            ) : (
              <Button
                variant="ghost"
                color="primary"
                startContent={<Send />}
                onClick={submitHandler}
              >
                Submit Comment
              </Button>
            )
          ) : (
            <Button
              isDisabled
              variant="ghost"
              color="primary"
              startContent={<Send />}
            >
              Submit Comment
            </Button>
          )}
        </div>
      </form>
      <div className="flex">
        <div className="flex items-center">
          <StarIcon className="w-4 h-4 fill-gray-900 dark:fill-gray-50" />
          <div>: {curCommentScore}</div>
        </div>
        <div className="flex items-center ml-10">
          <MessageSquareText className="w-4 h-4 fill-gray-900 dark:fill-gray-50" />
          <div>: {curCommentNum}</div>
        </div>
      </div>
      <div className="space-y-6 overflow-y-auto max-h-[240px]">
        {commentData.map((item, index) => {
          return (
            <div key={index} className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage alt="@shadcn" />
                <AvatarFallback>
                  {item.User.Name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-lg">{item.User.Name}</div>

                  <div className="flex justify-between min-w-[240px]">
                    <div className="flex items-center gap-1 mr-10">
                      {Array.from({ length: item.point }).map((_, index) => {
                        return (
                          <StarIcon
                            key={index}
                            className="w-4 h-4 fill-gray-900 dark:fill-gray-50"
                          />
                        );
                      })}
                      {Array.from({ length: 5 - item.point }).map(
                        (_, index) => {
                          return (
                            <StarIcon
                              key={index}
                              className="w-4 h-4 fill-gray-100 stroke-gray-500 dark:fill-gray-800 dark:stroke-gray-400"
                            />
                          );
                        }
                      )}
                    </div>
                    <time className="block text-xs text-gray-500 dark:text-gray-400 min-h-[55px]:">
                      {getTimeDifference(item.modifyTime)}
                    </time>
                  </div>
                </div>
                <pre>{item.content}</pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
