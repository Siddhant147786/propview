import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Register() {
  const navigate = useNavigate();
  const no_of_digits = 6;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [inputotp, setInputOtp] = useState(new Array(no_of_digits).fill(""));
  const otpRefs = useRef([]);
  const [otpSent, SetOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch("/api/register", {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // specify JSON format
      },
      body: JSON.stringify({
        email: email,
        name: name,
        phone: phone,
        password: password,
      }), // convert JS object to JSON string
    });

    const data = await response.json();

    if (response.ok) {
      navigate("/signin");
    } else {
      alert(data.message);
    }
  }

  async function handleClickVerify(event) {
    event.preventDefault();

    const result = await fetch("/api/verifyotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // specify JSON format
      },
      body: JSON.stringify({
        email: email,
        otp: inputotp.join(""),
      }),
    });
  }

  async function handleClickOtpGenerate(event) {
    event.preventDefault();
    if (!event.currentTarget.form.reportValidity()) {
      return;
    }

    const response = await fetch("/api/generateotp", {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // specify JSON format
      },
      body: JSON.stringify({
        email: email,
      }), // convert JS object to JSON string
    });

    const data = await response.json();
    // if otp is sent correctly
    if (response.ok) {
      alert("otp sent successfully: ");
      SetOtpSent(true);
      setOtpVerified(false);
    } else {
      setOtpVerified(false);
      alert(data.message);
    }

    // if not sent correctly
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f3] px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#d9e0d8] bg-white p-8 sm:p-10">
          <h1 className="text-3xl font-semibold text-[#1b3025]">
            Create an account
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#59695f]">
            Start your home search with PropView.
          </p>

          <form className="mt-8 flex flex-col" onSubmit={handleSubmit}>
            <label
              className="mb-2 text-sm font-semibold text-[#1b3025]"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              className="mb-5 h-12 w-full rounded-xl border border-[#d9e0d8] bg-white px-4 text-[#1b3025] placeholder:text-[#59695f] focus:border-[#164b38] focus:outline-none focus:ring-2 focus:ring-[#164b38]/20"
              type="text"
              name="name"
              id="name"
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />

            <label
              className="mb-2 text-sm font-semibold text-[#1b3025]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="mb-5 h-12 w-full rounded-xl border border-[#d9e0d8] bg-white px-4 text-[#1b3025] placeholder:text-[#59695f] focus:border-[#164b38] focus:outline-none focus:ring-2 focus:ring-[#164b38]/20"
              type="email"
              name="email"
              id="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                SetOtpSent(false);
                setOtpVerified(false);
                setInputOtp(new Array(no_of_digits).fill(""));
              }}
            />

            <label
              className="mb-2 text-sm font-semibold text-[#1b3025]"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="mb-5 h-12 w-full rounded-xl border border-[#d9e0d8] bg-white px-4 text-[#1b3025] placeholder:text-[#59695f] focus:border-[#164b38] focus:outline-none focus:ring-2 focus:ring-[#164b38]/20"
              type="password"
              name="password"
              id="password"
              required
              value={password}
              minLength={8}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />

            <label
              className="mb-2 text-sm font-semibold text-[#1b3025]"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              className="mb-5 h-12 w-full rounded-xl border border-[#d9e0d8] bg-white px-4 text-[#1b3025] placeholder:text-[#59695f] focus:border-[#164b38] focus:outline-none focus:ring-2 focus:ring-[#164b38]/20"
              type="number"
              name="phone"
              id="phone"
              maxLength={10}
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
              }}
            />

            <button
              className="mt-1 h-12 w-full rounded-xl bg-[#164b38] text-sm font-semibold text-white transition-colors hover:bg-[#103d2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164b38] focus-visible:ring-offset-2"
              type="button"
              onClick={handleClickOtpGenerate}
            >
              Send OTP
            </button>

            {otpSent && (
              <div className="mt-5 flex gap-2">
                {inputotp.map((number, index) => {
                  return (
                    <input
                      autoFocus={index === 0}
                      className="h-12 min-w-0 flex-1 rounded-lg border border-[#d9e0d8] text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#164b38]"
                      key={index}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      value={number}
                      type="text"
                      onChange={(event) => {
                        const value = event.target.value;

                        const digit = value.slice(-1);

                        setInputOtp((previous) => {
                          const updated = [...previous];
                          updated[index] = digit;
                          return updated;
                        });

                        if (digit && index < no_of_digits - 1) {
                          otpRefs.current[index + 1]?.focus();
                        }
                      }}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Backspace" &&
                          !inputotp[index] &&
                          index > 0
                        ) {
                          event.preventDefault();
                          otpRefs.current[index - 1]?.focus();
                        }
                      }}
                      onFocus={(event) => {
                        event.target.select();
                      }}
                    />
                  );
                })}
                <button type="button" onClick={handleClickVerify}>
                  Verify Otp
                </button>
              </div>
            )}

            {otpVerified && (
              <button type="submit">
                Regitser
              </button>
            )}
          </form>
          <p className="mt-6 text-center text-sm text-[#59695f]">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-[#164b38] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
