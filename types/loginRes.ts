import { Student } from "./student"

export type LoginResponse = {
    success: boolean
    message: string
    token: string
    student: Student
    ImgUrl: string
}
