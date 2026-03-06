export interface Project {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    tech_stack: string[];
    github_url: string | null;
    live_url: string | null;
    created_at: string;
}

export interface Experience {
    id: string;
    role: string;
    company: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
    current: boolean;
    created_at: string;
}
