import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

interface IJoiValidationPipeConfig {
  useShemaErrorMessage?: boolean;
  errorMessage?: string;
}

@Injectable()
export class JoiValidationPipe<DTO extends object>
  implements PipeTransform<DTO>
{
  constructor(
    private readonly _schema: ObjectSchema,
    private readonly _config?: IJoiValidationPipeConfig,
  ) {}

  transform(value: DTO, metadata: ArgumentMetadata): DTO {
    const { error } = this._schema.validate(value);
    const defaultErrorMessage =
      this._config?.errorMessage ?? 'Input data validation failed.';
    const errorMessage = this._config?.useShemaErrorMessage
      ? error?.message
      : defaultErrorMessage;
    if (error) throw new BadRequestException(errorMessage);
    return value;
  }
}
