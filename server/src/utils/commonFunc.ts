import * as fs from "fs";

export function checkExistFolder(directory: string): void {
  // Проверяем существует ли папка, если нет - создаем её
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}
export function gbToBytes(gb: number): number {
  return gb * 1024 * 1024 * 1024;
}
export function getUniqueNumbers(arr: number[]): number[] {
  return [...new Set(arr)];
}
export function bytesToGb(bytes: number): number {
  return Math.round((bytes / (1024 * 1024 * 1024)) * 100) / 100;
}
export function deleteFile(path: string): void {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

export const getRandomInt = (codeLength: number): string => {
  const givenSet: string = "0123456789";
  let code: string = "";
  for (let i = 0; i < codeLength; i++) {
    let pos: number = Math.floor(Math.random() * givenSet.length);
    code += givenSet[pos];
  }
  return code;
};

export const getRandomString = (length: number): string => {
  const charSet: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let str: string = "";
  for (let i = 0; i < length; i++) {
    let pos: number = Math.floor(Math.random() * charSet.length);
    str += charSet[pos];
  }
  return str;
};

export function validateEmail(email: string) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
export async function sleep(timeout: number) {
  return await new Promise((res) => setTimeout(res, timeout));
}

export function checkPassword(password: string) {
  // Проверка наличия символа
  // if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
  //   return false;
  // }

  // Проверка наличия буквы верхнего регистра
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Проверка наличия буквы нижнего регистра
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Проверка длины пароля
  if (password.length < 8) {
    return false;
  }

  // Все условия выполнены
  return true;
}

