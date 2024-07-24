import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import { registeredPw } from "@/hooks/search/useSearchPw";
import { generateToken } from "@/lib/tokenService";
import { BASE_URL } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const { email, type, name, userId } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "이메일을 입력하세요." }, { status: 400 });
    }

    if (type === "passwordReset") {
      // 비밀번호 재설정 요청 처리
      const formData = new FormData();
      formData.append("name", name);
      formData.append("userId", userId);
      formData.append("email", email);

      const result = await registeredPw(formData);

      if (result.success) {
        return NextResponse.json({ message: result.message }, { status: 200 });
      } else {
        return NextResponse.json({ message: result.message }, { status: 500 });
      }
    } else {
      // 일반 메일 발송 처리

      const token = generateToken(email);

      const mailResult = await sendEmail({
        to: email,
        subject: "메일 인증을 해주세요",
        message: `안녕하세요, ${name}님. 인증을 위해 아래 링크를 클릭해주세요.`,
        link: `${BASE_URL}/sign?token=${token}`,
      });

      if (mailResult) {
        return NextResponse.json({ status: 200 });
      } else {
        throw new Error("이메일 발송에 실패했습니다.");
      }
    }
  } catch (error) {
    console.error("이메일 발송 에러:", error);
    return NextResponse.json({ message: "이메일 발송에 실패했습니다." }, { status: 500 });
  }
}
