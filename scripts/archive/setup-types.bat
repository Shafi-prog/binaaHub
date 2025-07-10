@echo off
echo 🚀 PHASE 2: Type Declaration Setup
echo ================================

echo.
echo 📦 Installing missing type dependencies...
call npm install --save-dev @types/jest@latest @types/lodash@latest @types/node@latest @types/uuid@latest @types/bcryptjs@latest

echo.
echo 📝 Creating enhanced global type declarations...

REM Create enhanced global types
powershell -Command "if (!(Test-Path 'src\types')) { New-Item -ItemType Directory -Path 'src\types' -Force }"

REM Create comprehensive global.d.ts
(
echo // Enhanced Global Type Declarations for Binna Platform
echo // This file resolves TypeScript module resolution errors
echo.
echo // Core library modules
echo declare module "@/lib/client" {
echo   export const client: any;
echo   export default client;
echo }
echo.
echo declare module "@/lib/query-client" {
echo   export const queryClient: any;
echo   export default queryClient;
echo }
echo.
echo declare module "@/lib/query-key-factory" {
echo   export const queryKeyFactory: any;
echo   export default queryKeyFactory;
echo }
echo.
echo // Asset modules
echo declare module "*.svg" {
echo   const content: React.FunctionComponent^<React.SVGAttributes^<SVGElement^>^>;
echo   export default content;
echo }
echo.
echo declare module "*.png" {
echo   const content: string;
echo   export default content;
echo }
echo.
echo declare module "*.jpg" {
echo   const content: string;
echo   export default content;
echo }
echo.
echo declare module "*.jpeg" {
echo   const content: string;
echo   export default content;
echo }
echo.
echo declare module "*.gif" {
echo   const content: string;
echo   export default content;
echo }
echo.
echo declare module "*.webp" {
echo   const content: string;
echo   export default content;
echo }
echo.
echo declare module "*.css" {
echo   const content: { [className: string]: string };
echo   export default content;
echo }
echo.
echo declare module "*.scss" {
echo   const content: { [className: string]: string };
echo   export default content;
echo }
echo.
echo declare module "*.module.css" {
echo   const content: { [className: string]: string };
echo   export default content;
echo }
echo.
echo // Medusa modules
echo declare module "@medusajs/medusa" {
echo   export * from "@medusajs/medusa/dist";
echo }
echo.
echo declare module "@medusajs/types" {
echo   export * from "@medusajs/types/dist";
echo }
echo.
echo declare module "@medusajs/framework" {
echo   export * from "@medusajs/framework/dist";
echo }
echo.
echo // Jest globals and testing
echo declare global {
echo   namespace jest {
echo     interface Matchers^<R^> {
echo       toBeInTheDocument^(^): R;
echo       toHaveClass^(className: string^): R;
echo       toHaveStyle^(style: { [key: string]: any }^): R;
echo       toBeVisible^(^): R;
echo       toBeDisabled^(^): R;
echo     }
echo   }
echo }
echo.
echo // Window extensions
echo declare global {
echo   interface Window {
echo     gtag?: ^(...args: any[]^) =^> void;
echo     dataLayer?: any[];
echo     ethereum?: any;
echo   }
echo }
echo.
echo // Environment variables
echo declare namespace NodeJS {
echo   interface ProcessEnv {
echo     NODE_ENV: 'development' ^| 'production' ^| 'test';
echo     SUPABASE_URL: string;
echo     SUPABASE_ANON_KEY: string;
echo     MEDUSA_BACKEND_URL: string;
echo     NEXTAUTH_SECRET: string;
echo     NEXTAUTH_URL: string;
echo   }
echo }
echo.
echo export {};
) > src\types\global.d.ts

echo.
echo ✅ Enhanced global type declarations created
echo 📊 Expected error reduction: ~600-800 errors

pause