export const ValidationOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  validationError: {
    target: false, // 민감한 정보가 응답에 포함될 위험이 있어 false 처리
  },
};
