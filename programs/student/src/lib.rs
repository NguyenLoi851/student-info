use anchor_lang::prelude::*;
use instructions::*;
// use state::*;

pub mod state;
pub mod instructions;

declare_id!("GVkXXNcupgjyTj7H45ESHn28bf2Jf9B3y1BBp1Y7msZ8");

#[program]
pub mod student {
    // use crate::state::SexState;

    use super::*;

    pub fn initialize_student_instruction(ctx: Context<InitializeStudentInfo>, age: u8, name: String) -> Result<()> {
        initialize_student_info(ctx, age, name)
    }

    // pub fn initialize_student_instruction(ctx: Context<InitializeStudentInfo>, age: u8, name: String, sex: SexState) -> Result<()> {
    //     initialize_student_info(ctx, age, name, sex)
    // }

    pub fn update_student_instruction(ctx: Context<UpdateStudentInfo>, age: u8, name: String) -> Result<()> {
        instructions::update_student_info::update_student_info(ctx, age, name)
    }

    pub fn delete_student_instruction(ctx: Context<DeleteStudentInfo>, name: String) -> Result<()> {
        instructions::delete_student_info::delete_student_info(ctx, name)
    }

    pub fn initialize_student_instruction_test(ctx: Context<InitializeStudentInfoTest>, age: u8, name: String) -> Result<()> {
        initialize_student_info_test(ctx, age, name)
    }
}
