# INHERIT FROM TIC-TAC-TOE REPO
# Process

Write program

anchor build

anchor test

anchor key list >> copy pubkey to declare_id!() in lib.rs AND also update in Anchor.toml
// or solana address -k target/deploy/tic_tac_toe-keypair.json

anchor build (again to include new program id in the binary)

Change provider.cluster in Anchor.toml to devnet

anchor deploy

anchor test

# Fix error:

- Not enough token amounts:

solana address // return <pubkey-string> of your keypair

solana airdrop 2 <pubKey> --url https://api.devnet.solana.com

- BPF - not a directory

rm -rf ./cache/solana/<version-folder-name>

# Write Program

- Logic start program/<prj-name>/src/lib.rs file

- First create game state

- When write any instructions, we need create two things: a struct and a function

- Struct which used for initializing state need to be declared size of space for data of state account, payer and system program

- Struct which used for other function (different above) need a field for state to declare which account will be changed data

# Utils

- Cli with solana:

(solana --help)

solana balance --url http://api.devnet.solana.com

- Get public key with some format:

$ cat /home/cloud/.config/solana/id.json > return: [uint8; 64] = seckey + pubkey

// in file index.js: 

const adminKeyPair = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from(
        [25, 147, 104, 88, 211, 14, 214, 228, 254, 100, 17, 104, 2, 198, 228, 175, 111, 1, 78, 146, 244, 248, 114, 237, 73, 126, 57, 170, 250, 253, 47, 27, 107, 5, 181, 9, 116, 75, 101, 180, 143, 52, 184, 189, 6, 110, 72, 55, 133, 119, 94, 111, 189, 248, 201, 81, 210, 25, 247, 224, 127, 14, 216, 8]
    )
)

console.log(adminKeypair) > return [uint8; 64] 

console.log(adminKeypair.secretKey) > return [uint8; 64]

console.log(adminKeypair.publicKey) > return [uint8; 32] = adminKeypair.secretKey[32:] (can be in format of BN): <BN:6b05b509744b65b48f34b8bd066e483785775e6fbdf8c951d219f7e07f0ed808>

console.log(adminKeyPair.publicKey.toBuffer()) > Buffer like: <Buffer 6b 05 b5 09 74 4b 65 b4 8f 34 b8 bd 06 6e 48 37 85 77 5e 6f bd f8 c9 51 d2 19 f7 e0 7f 0e d8 08>

console.log(bs58.encode(adminKeyPair.publicKey.toBuffer())) > return base58-string like: 8N3KndJsrisTqM9q1i1G7gFnRQknxhf57HqpXgRHvNuR

===================================================================================================================================================================================================================================================================================================

# INHERIT FROM SUM REPO

# Change branch to see code from basic to standard

# Flow to write new instruction

- 1: Declare state in crate::state

- 2: Declare related account in crate::instructions

- 3: Declare function in crate::instructions

- 4: Declare instruction in crate::lib

- 5: $ anchor keys list OR $ solana address -k target/deploy/sum-keypair.json to get Program ID and replace in lib.rs

# Flow and Note (base on test file)

Note 1: program.provider.publicKey is address of your wallet in your local computer (/home/user/.config/solana)

(it means program.provider.publicKey.toBase58() = $ solana address)

- Flow 1: Generate a keypair for sum account

Note 2: This is only keypair of sum account, not an account

- Flow 2: Send transaction with initialize instruction to solana network

- Flow 2.1: We need to pass accounts related to transaction / instructions. To get accounts of a instruction, we have 2 ways. First solution, we find function corresponds to instructions in lib.rs, then find struct is declared in ctx; after that accounts in struct are what we need to pass in instruction. Second solution, which is faster and done by front-end, find in IDL file.

- Flow 2.1.1: Sum-Program will invoke System Program to create new Sum account with sum keypair, which is declared first.

- Flow 2.1.2: System Program create new Sum Account and transfer ownership of Sum Account to Sum Program. Then, Sum Program can write to Sum Account.

- Flow 2.2: We need to pass signers, which are writable in instruction.

Note 3: With anchor, we do not need to pass accounts of DEFAULT / PROGRAM user in signatures parts. It will be automatically done by anchor. 

Note 4: When creating struct to increase value for Sum Account, if we forget to declare #[account(mut)] for sum_account, test file will not return error.

===================================================================================================================================================================================================================================================================================================

# SELF

In test file, when you generate a new account, you need to airdrop SOL for this account. If not, you can meet error with code 0x1
```
const signature = await program.provider.connection.requestAirdrop(
    loiAccount.publicKey,
    LAMPORTS_PER_SOL * 1000
)

await program.provider.connection.confirmTransaction(signature);
```

Note: requestAirdrop() return signature of airdrop transaction, we need wait until transaction will be confirmed.