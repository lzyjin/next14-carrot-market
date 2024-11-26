export const PASSWORD_MIN_LENGTH = 4;

// 영어 소문자, 대문자, 숫자, #?!@$%^&*- 이 특수문자 중 하나의 특수문자를 반드시 포함
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);

export const PASSWORD_REGEX_ERROR = "A password must have lowercase, UPPERCASE, a number and special characters.";