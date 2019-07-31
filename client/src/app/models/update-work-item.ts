import { FileEntity } from './file-entity';

export class UpdateWorkItem {
    title: string;
  
    description: string;

    tags: {name: string}[];

    filesToBeRemoved: FileEntity[];
}