import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export const initSocket = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // Join a quiz room
      socket.on("join-quiz", (quizId: string, studentName: string) => {
        socket.join(`quiz:${quizId}`)

        // Notify teacher that a student joined
        io.to(`quiz:${quizId}:teacher`).emit("student-joined", {
          id: socket.id,
          name: studentName,
        })

        console.log(`${studentName} joined quiz ${quizId}`)
      })

      // Teacher monitoring a quiz
      socket.on("monitor-quiz", (quizId: string) => {
        socket.join(`quiz:${quizId}:teacher`)
        console.log(`Teacher monitoring quiz ${quizId}`)
      })

      // Student submitting an answer
      socket.on(
        "submit-answer",
        (data: {
          quizId: string
          questionId: string
          answer: string
          studentName: string
        }) => {
          // Notify teacher about the answer
          const { quizId } = data
          io.to(`quiz:${quizId}:teacher`).emit("student-answer", {
            studentId: socket.id,
            studentName: data.studentName,
            questionId: data.questionId,
            answer: data.answer,
          })
        },
      )

      // Student completing a quiz
      socket.on(
        "complete-quiz",
        (data: {
          quizId: string
          studentName: string
          score: number
          timeSpent: string
        }) => {
          // Notify teacher about completion
          const { quizId } = data
          io.to(`quiz:${quizId}:teacher`).emit("student-completed", {
            studentId: socket.id,
            studentName: data.studentName,
            score: data.score,
            timeSpent: data.timeSpent,
          })

          // Update leaderboard for all students
          io.to(`quiz:${data.quizId}`).emit("leaderboard-update", {
            studentName: data.studentName,
            score: data.score,
          })
        },
      )

      // Teacher ending a quiz
      socket.on("end-quiz", (quizId: string) => {
        // Notify all students that the quiz has ended
        io.to(`quizId`).emit("quiz-ended")
        console.log(`Quiz ${quizId} ended by teacher`)
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }

  return res.socket.server.io
}

