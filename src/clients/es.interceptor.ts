import { Interceptor } from "@nestcloud/http";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestConfig } from "axios";
import { ES_PASS, ES_URL, ES_USER } from "../constants/env.constants";
import { isNumeric } from "rxjs/internal-compatibility";

@Injectable()
export class EsInterceptor implements Interceptor {
    constructor(
        private readonly config: ConfigService,
    ) {
    }

    onRequest(request: AxiosRequestConfig): AxiosRequestConfig {
        const url = this.config.get(ES_URL);
        const user = this.config.get(ES_USER);
        const pass = this.config.get(ES_PASS);
        const secret = `${user}:${pass}`;
        request.url = `${url}${request.url}`;
        request.headers['Authorization'] = `Basic ${new Buffer(secret).toString('base64')}`;
        return request;
    }
}

@Injectable()
export class EsBulkInterceptor implements Interceptor {
    onRequest(request: AxiosRequestConfig): AxiosRequestConfig {
        const index = request.url.split('/')[1];
        const params = [];
        Object.values(request.data).forEach((item: any) => {
            if (isNumeric(item)) {
                params.push({
                    delete: {
                        _index: index,
                        _id: item,
                    },
                });
            } else {
                params.push({
                    index: {
                        _index: index,
                        _id: item.id,
                    },
                });
                params.push(item);
            }
        });
        request.data = params.map((item) => JSON.stringify(item)).join('\n') + '\n';
        return request;
    }
}
