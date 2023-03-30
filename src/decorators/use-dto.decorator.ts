import type { AbstractDto } from '../common/dto/abstract.dto';
import type { Constructor } from '../types';

export function UseDto(
  dtoClass: Constructor<AbstractDto, [unknown]>,
): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
