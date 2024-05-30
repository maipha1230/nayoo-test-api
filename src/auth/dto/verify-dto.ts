import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class verifyDto {
    @IsNotEmpty()
    @ApiProperty()
    token: string
}