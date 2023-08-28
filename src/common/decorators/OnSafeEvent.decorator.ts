import { applyDecorators, Logger } from '@nestjs/common';
import { OnEvent, OnEventType } from '@nestjs/event-emitter';
import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';

/**
 * @description OnEvent 의 경우 에러가 발생하면 서버가 멈춥니다. 이 문제를 해결하는 데코레이터입니다.
 * @source https://velog.io/@loakick/Nest.js-event-emitter%EC%97%90%EB%9F%AC-Error%EA%B0%80-%EB%B0%9C%EC%83%9D%ED%95%98%EB%A9%B4
 */
function _OnSafeEvent() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    const metaKeys = Reflect.getOwnMetadataKeys(descriptor.value);
    const metas = metaKeys.map((key) => [key, Reflect.getMetadata(key, descriptor.value)]);

    descriptor.value = async function (...args: any[]) {
      try {
        await originalMethod.call(this, ...args);
      } catch (err) {
        Logger.error(err, err.stack, 'OnSafeEvent');
      }
    };
    metas.forEach(([k, v]) => Reflect.defineMetadata(k, v, descriptor.value));
  };
}

export function OnSafeEvent(event: OnEventType, options?: OnEventOptions | undefined) {
  return applyDecorators(OnEvent(event, options), _OnSafeEvent());
}
