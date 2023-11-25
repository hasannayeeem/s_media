import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/register", "Api/Auth/AuthController.register");
  Route.post("/login", "Api/Auth/AuthController.login");
  Route.get("/verify-email/:token", "Api/Auth/AuthController.verify");
  Route.get(
    "/verify-password/:token",
    "Api/Auth/AuthController.verifyPassword"
  );
  Route.get("/resend-email", "Api/Auth/AuthController.resendEmail");
  Route.post(
    "/send-password-reset-email",
    "Api/Auth/AuthController.sendPasswordResetToken"
  );
  Route.post(
    "/resend-verify-email",
    "Api/Auth/AuthController.resendVerifyEmailToken"
  );
  Route.post("/store-password", "Api/Auth/AuthController.storePassword");
}).prefix("api/auth");

Route.group(() => {
  Route.get("/getUser", "Api/Auth/AuthController.getUser");
  Route.get("/logout", "Api/Auth/AuthController.logout");
})
  .prefix("api/auth")
  .middleware("auth");
Route.post(
  "auth/resend-email-by-token",
  "Api/Auth/AuthController.resendEmailByToken"
);

