use anchor_lang::prelude::*;
use crate::state::{StudentAccountState, SexState};

pub fn initialize_student_info(ctx: Context<InitializeStudentInfo>, age: u8, name: String) -> Result<()> {
// pub fn initialize_student_info(ctx: Context<InitializeStudentInfo>, age: u8, name: String, sex: SexState) -> Result<()> {
    msg!("Student Account Created");
    msg!("Age: {}", age);
    msg!("Name: {}", name);

    let student = &mut ctx.accounts.student;
    student.student_wallet = ctx.accounts.initializer.key();
    student.age = age;
    student.name = name;
    // student.sex = sex;
    Ok(())
}

#[derive(Accounts)]
#[instruction(age: u8, name: String)] // add age
pub struct InitializeStudentInfo<'info> {
    #[account(
        init,
        seeds = [name.as_bytes(), initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = 8 + 32 + 1 + 4 + name.len()
    )]
    pub student: Account<'info, StudentAccountState>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>
}