use anchor_lang::prelude::*;

#[account]
pub struct StudentAccountStateTest {
    // pub student_wallet: Pubkey, // 32
    pub age: u8, // 1
    pub name: String // 4 + length
    // pub sex: Enum
    // pub birthday: struct { day + month + year }
}