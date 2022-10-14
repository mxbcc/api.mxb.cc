import { Injectable } from "@nestjs/common";
import {
    Body,
    Head, Param,
    Post,
    Put,
    SetBody,
    SetHeader,
    SetQuery,
    UseInterceptors
} from "@nestcloud/http";
import { EsBulkInterceptor, EsInterceptor } from "./es.interceptor";

@Injectable()
@UseInterceptors(EsInterceptor)
export class EsClient {
    @Put('/:index')
    @SetQuery('include_type_name', true)
    createMapping(@Param('index') index: string, @Body() data: any) {
    }

    @Head('/:index')
    async isExists(@Param('index') index: string) {
    }

    @Post('/:index/_bulk')
    @SetHeader('Content-Type', 'application/x-ndjson')
    @UseInterceptors(EsInterceptor, EsBulkInterceptor)
    async bulkCreate<T extends any = any>(@Param('index') index: string, @Body() data: T[]) {
    }

    @Post('/:index/_search')
    async search(@Param('index') index: string, @Body() params: any): Promise<any> {
    }

    @Post('/_analyze')
    @SetBody('field', 'title')
    async getAnalyzeTokens(
        @Body('analyzer') analyzer: string,
        @Body('text') keyword: string,
    ): Promise<string[]> {
        return [];
    }
}
