use std::env;
use std::process;

struct ProjectDraft {
    title: String,
    builder_handle: String,
    stack: Vec<String>,
}

impl ProjectDraft {
    fn validate(&self) -> Result<(), String> {
        if self.title.trim().len() < 3 {
            return Err("Project title must be at least 3 characters long.".to_string());
        }
        if !self.builder_handle.starts_with('@') || self.builder_handle.len() < 2 {
            return Err("Builder handle must start with '@' (e.g., @fathiaomar).".to_string());
        }
        if self.stack.is_empty() {
            return Err("At least one technology tag is required.".to_string());
        }
        Ok(())
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let title = args.get(1).cloned().unwrap_or_else(|| "Ship Together CLI".to_string());
    let handle = args.get(2).cloned().unwrap_or_else(|| "@fathiaomar".to_string());
    let stack_raw = args.get(3).cloned().unwrap_or_else(|| "Rust,TypeScript,Solidity".to_string());

    let draft = ProjectDraft {
        title,
        builder_handle: handle,
        stack: stack_raw
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect(),
    };

    match draft.validate() {
        Ok(()) => {
            println!(
                "[OK] Ready to publish '{}' by {} (stack: {})",
                draft.title,
                draft.builder_handle,
                draft.stack.join(", ")
            );
        }
        Err(err) => {
            eprintln!("[ERROR] {}", err);
            process::exit(1);
        }
    }
}
