import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';

@Module({
  controllers: [SearchController],
  imports: [],
  providers: [],
})
export class SearchModule {}
