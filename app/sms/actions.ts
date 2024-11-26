"use server";

import {z} from "zod";
import validator from "validator";
import {redirect} from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, "ko-KR"), "Wrong phone format");

const tokenSchema = z
  .coerce
  .number()
  .min(100000)
  .max(999999);

interface ActionState {
  token: boolean;
}

export async function smsLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  // prevState.token이 false
  // action을 처음 호출
  // 사용자가 전화번호만 입력
  if(!prevState.token) {
    const result = phoneSchema.safeParse(phone);

    // 뭐가 됐던 간에 반환하는 값은 (SMSLogin에서 사용하는) state가 된다.
    if (!result.success) {
      console.log(result.error.flatten());

      return {
        token: false,
        error: result.error.flatten(),
      };

    } else {
      return {
        token: true,
      };
    }

  } else {
    const result = tokenSchema.safeParse(token);

    if(!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };

    } else {
      // SMS 로그인 성공
      redirect("/");
    }
  }
}