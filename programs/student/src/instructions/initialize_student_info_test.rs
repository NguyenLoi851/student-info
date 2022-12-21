use anchor_lang::prelude::*;
use crate::state::StudentAccountStateTest;

pub fn initialize_student_info_test(ctx: Context<InitializeStudentInfoTest>, age: u8, name: String) -> Result<()> {
    msg!("Student Account Created");
    msg!("Age: {}", age);
    msg!("Name: {}", name);

    let student = &mut ctx.accounts.student;
    student.age = age;
    student.name = name;
    Ok(())
}

#[derive(Accounts)]
#[instruction(age: u8, name: String)]
pub struct InitializeStudentInfoTest<'info> {
    #[account(init, payer=initializer, space = 8+1+4+name.len())]
    pub student: Account<'info, StudentAccountStateTest>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>
}