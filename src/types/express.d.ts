import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      username: string;
    };
  }
}
// nestjs에서 request 타입 확장 참고 링크
// https://medium.com/@letnaturebe2/nestjs%EC%97%90%EC%84%9C-request%EB%A5%BC-%EC%8A%A4%EB%A7%88%ED%8A%B8%ED%95%98%EA%B2%8C-%ED%99%95%EC%9E%A5%ED%95%98%EA%B8%B0-f2a78cc7e652
