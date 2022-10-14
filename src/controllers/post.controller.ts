import { Controller, Get, Query } from "@nestjs/common";
import { PostService } from "../services";

@Controller('/apis/posts')
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) {
    }

    @Get()
    search(@Query('keyword') keyword: string) {
        return this.postService.search(keyword);
    }
}
