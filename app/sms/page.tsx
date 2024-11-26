"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import {smsLogIn} from "@/app/sms/actions";
import {useFormState} from "react-dom";

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogIn, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">

      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>

      <form action={dispatch} className="flex flex-col gap-3">
        {
          state.token ?
          (
            <Input
              name="token"
              type="number"
              placeholder="Verification code"
              required={true}
              min={100000}
              max={999999}
              errors={state.error?.formErrors}
              key="token-input"
            />
          )
          :
          (
            <Input
              name="phone"
              type="text"
              placeholder="Phone number"
              required={true}
              errors={state.error?.formErrors}
              key="phone-input"
            />
          )
        }
        <Button text={state.token? "Verify Token" : "Send Verification SMS"} />
      </form>

    </div>
  );
}