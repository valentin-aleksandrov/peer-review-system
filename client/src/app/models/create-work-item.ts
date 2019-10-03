export class CreateWorkItem {
    title: string;
    description: string;
    reviewers: {username: string}[];
    tags: {name: string}[];
    team: string;
}