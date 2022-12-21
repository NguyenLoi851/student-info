use anchor_lang::prelude::*;
use crate::state::StudentAccountState;

pub fn update_student_info(ctx: Context<UpdateStudentInfo>, age: u8, name: String) -> Result<()> {
    msg!("Student info space reallocated");
    msg!("Age: {}", age);
    msg!("Name: {}", name);
    let student = &mut ctx.accounts.student;
    student.age = age;
    student.name = name;

    Ok(())
}

#[derive(Accounts)]
#[instruction(age: u8, name: String)]
pub struct UpdateStudentInfo<'info> {
    #[account(
        mut,
        seeds = [name.as_bytes(), initializer.key().as_ref()],
        bump,
        realloc = 8 + 32 + 1 + 4 + name.len(),
        realloc::payer = initializer,
        realloc::zero = true,
    )]
    pub student: Account<'info, StudentAccountState>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>
}