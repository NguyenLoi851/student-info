use anchor_lang::prelude::*;

// use super::SexState;

#[account]
pub struct StudentAccountState {
    pub student_wallet: Pubkey, // 32
    pub age: u8, // 1
    pub name: String, // 4 + length
    // pub sex: SexState // 1
    // pub birthday: struct { day + month + year }
}