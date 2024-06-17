// 从 @nestjs/core 模块中导入 NestFactory，用于创建 Nest 应用实例
import { NestFactory } from '@nestjs/core';
// 导入应用的根模块 AppModule
import { AppModule } from './app.module';
// 定义一个异步函数 bootstrap，用于启动应用
async function bootstrap() {
  // 使用 NestFactory.create 方法创建一个 Nest 应用实例，并传入根模块 AppModule
  const app = await NestFactory.create(AppModule);
  // 让应用监听 3000 端口
  await app.listen(3000);
}
// 调用 bootstrap 函数，启动应用
bootstrap();