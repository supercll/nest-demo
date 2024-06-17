import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/* --------------类装饰器-------------- */

function addTimestamp<T extends { new(...args: any[]) }>(constructor: T) {
  return class extends constructor {
    timestamp = new Date()
  }
}
interface Document {
  timestamp: Date
}

@addTimestamp
class Document {
  constructor(public title: string) { }
}


function replaceConstructor<T extends { new(...args: any[]) }>(constructor: T) {
  return class extends constructor {
    constructor(...args) {
      super(...args);
      console.log('instance created')
    }
  }
}

@replaceConstructor
class User {
  constructor(public name: string) {
    console.log('User created')
  }
}
/* ----------------方法装饰器---------------- */
let users = {
  '001': { roles: ['admin'] },
  '002': { roles: ['member'] }
}
function authorize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  //获取老的函数
  const originalMethod = descriptor.value;
  //重定原型上的属性
  descriptor.value = function (...args: any[]) {
    let user = users[args[0]]
    if (user && user.roles.includes('admin')) {
      originalMethod.apply(this, args)
    } else {
      console.error(`User is not authorized to call this method`);

      // throw new Error(`User is not authorized to call this method`)
    }
  }
  return descriptor;
}

class AdminPanel {
  @authorize
  deleteUser(userId: string) {
    console.log(`User ${userId} is deleted`)
  }
}

/* -------------属性装饰器-------------- */
function defaultValue(value: any) {
  return function (target: any, propertyKey: string) {
    let val = value;
    const getter = function () {
      return val;
    }
    const setter = function (newValue) {
      val = newValue
    }
    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      configurable: true,
      get: getter,
      set: setter
    });
  }
}

class Settings {
  @defaultValue('dark')
  theme: string
  @defaultValue(30)
  timeout: number
}

@Controller('a')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('b')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('')
  getRes(): string {
    const doc = new Document('My Document')
    console.log(doc.title + doc.timestamp);
    const doc2 = new User('Alice')
    console.log(doc2.name)
    const adminPanel = new AdminPanel();
    adminPanel.deleteUser('001');
    adminPanel.deleteUser('002');
    const settings = new Settings();
    console.log(settings.theme)
    console.log(settings.timeout)

    return ''
  }
}