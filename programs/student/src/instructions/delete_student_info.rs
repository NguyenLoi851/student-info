use anchor_lang::prelude::*;
use crate::state::StudentAccountState;

pub fn delete_student_info(ctx: Context<DeleteStudentInfo>, name: String) -> Result<()> {
    msg!("Student info of {} deleted", ctx.accounts.student.name);
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct DeleteStudentInfo<'info> {
    #[account(
        mut,
        seeds=[name.as_bytes(), initializer.key().as_ref()],
        bump,
        close=initializer
    )]
    pub student: Account<'info, StudentAccountState>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>
}