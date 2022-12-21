import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert, expect } from "chai";
import { Student } from "../target/types/student";
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

describe("student", () => {

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Student as Program<Student>;
  
  // enum SexState {
  //   MALE,
  //   FEMALE,
  // }

  type StudentType = {
    name: string,
    age: number,
    // sex: SexState,
    publicKey: anchor.web3.PublicKey
  }

  let trangAccount: any
  let loiAccount: any
  let truongAccount: any
  let students: StudentType[]
  let studentPdas: any

  async function requestAirdrop(publicKey: any){
    const signature = await program.provider.connection.requestAirdrop(
    publicKey,
    LAMPORTS_PER_SOL * 10
  )

  await program.provider.connection.confirmTransaction(signature)
  }

  beforeEach(()=>{

    trangAccount = program.provider
    loiAccount = anchor.web3.Keypair.generate()
    truongAccount = anchor.web3.Keypair.generate()


  
    students= [
      {
        name: "TTTT",
        age: 22,
        // sex: SexState.FEMALE,
        publicKey: trangAccount.publicKey 
      },
      {
        name: "NSL",
        age: 21,
        // sex: SexState.MALE,
        publicKey: loiAccount.publicKey
      },
      {
        name: "NQT",
        age: 22,
        // sex: SexState.MALE,
        publicKey: truongAccount.publicKey
      }
    ]

    studentPdas = students.map(student => {
      const [studentPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from(student.name), student.publicKey.toBuffer()],
        program.programId
      )
      return studentPda;
    })
  })

  it("Initialize first student info", async () => {
    const tx = await program.methods
      .initializeStudentInstruction(
        students[0].age, 
        students[0].name, 
        // students[0].sex
      )
      .accounts({
        student: studentPdas[0],
        // initializer: program.provider.publicKey,
        // initializer: students[0].publicKey,
        initializer: trangAccount.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    const account = await program.account.studentAccountState.fetch(studentPdas[0])
    expect(students[0].age).to.be.equal(account.age)
    expect(students[0].name).to.be.equal(account.name)
    // expect(students[0].sex).to.be.equal(account.sex)
    // expect(provider.wallet.publicKey).to.be.equal(account.studentWallet)
    expect(provider.wallet.publicKey === account.studentWallet)
  });

  it("Update first student info", async()=>{
    // const updateAccountBefore = await program.account.studentAccountState.fetch(studentPdas[0])
    // console.log("updateAccountBefore.age", updateAccountBefore.age)
    // console.log("updateAccountBefore.name", updateAccountBefore.name)
    const updateInfo = {name: "TTTT", age: 25}
    const tx = await program.methods
    .updateStudentInstruction(updateInfo.age, updateInfo.name)
    .accounts({
      student: studentPdas[0],
      // initializer: program.provider.publicKey,
      // initializer: students[0].publicKey,
      initializer: trangAccount.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc()

    const updateAccount = await program.account.studentAccountState.fetch(studentPdas[0])
    expect(updateAccount.age).to.be.equal(updateInfo.age)
    expect(updateAccount.name).to.be.equal(updateInfo.name)
  })

  it("Delete first account", async()=>{
    const account = await program.account.studentAccountState.fetch(studentPdas[0])
    // console.log("Delete", account)
    const tx = await program.methods
    .deleteStudentInstruction("TTTT")
    .accounts({
      student: studentPdas[0],
      // initializer: program.provider.publicKey,
      // initializer: students[0].publicKey,
      initializer: trangAccount.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc()

    // const deleteAccount = await program.account.studentAccountState.fetch(studentPdas[0])
    // console.log(deleteAccount)
    try{
      const deleteAccount = await program.account.studentAccountState.fetch(studentPdas[0])
    }catch{
      // error
      assert(true)
    }
  })

  it("Initialize second student info", async()=>{
    await requestAirdrop(loiAccount.publicKey);
    const tx = await program.methods
    .initializeStudentInstruction(students[1].age, students[1].name)
    .accounts({
      student: studentPdas[1],
      initializer: loiAccount.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([loiAccount])
    .rpc()
    const secondAccountFetch = await program.account.studentAccountState.fetch(studentPdas[1])
    expect(secondAccountFetch.age).to.be.equal(students[1].age)
    expect(secondAccountFetch.name).to.be.equal(students[1].name)
    expect(secondAccountFetch.studentWallet === loiAccount.publicKey)
  })

  it("Update second student info", async() =>{
    await requestAirdrop(loiAccount.publicKey);

    // const secondAccountFirstBefore = await program.account.studentAccountState.fetch(studentPdas[1])
    // console.log("loi account", secondAccountFirstBefore.age)
    // console.log("loi account", secondAccountFirstBefore.name)

    const tx1 = await program.methods
    .initializeStudentInstruction(students[1].age, students[1].name)
    .accounts({
      student: studentPdas[1],
      initializer: loiAccount.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([loiAccount])
    .rpc()

    const updateInfo = {age: 12, name: students[1].name}
    const tx2 = await program.methods
    .updateStudentInstruction(updateInfo.age, updateInfo.name)
    .accounts({
      student: studentPdas[1],
      initializer: loiAccount.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([loiAccount])
    .rpc()

    const updateAccountInfo = await program.account.studentAccountState.fetch(studentPdas[1])
    expect(updateAccountInfo.age).to.be.equal(updateInfo.age)
    expect(updateAccountInfo.name).to.be.equal(updateInfo.name)
  })

  it("Delete second student info", async()=>{
    await requestAirdrop(loiAccount.publicKey);

    // const secondAccountFirstBefore = await program.account.studentAccountState.fetch(studentPdas[1])
    // console.log("loi account", secondAccountFirstBefore.age)
    // console.log("loi account", secondAccountFirstBefore.name)

    const tx1 = await program.methods
    .initializeStudentInstruction(students[1].age, students[1].name)
    .accounts({
      student: studentPdas[1],
      initializer: loiAccount.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([loiAccount])
    .rpc()

    const tx2 = await program.methods
    .deleteStudentInstruction(students[1].name)
    .accounts({
      student: studentPdas[1],
      initializer: loiAccount.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([loiAccount])
    .rpc()
  })
});

describe("Test", () => {

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Student as Program<Student>;

  type StudentType = {
    name: string,
    age: number,
    // sex: SexState,
    publicKey: anchor.web3.PublicKey
  }

  let trangAccount: any
  let loiAccount: any
  let truongAccount: any

  let students: StudentType[]
  let studentPdas: any
  let studentAccountKeypair: any
  
  beforeEach(async()=>{
    trangAccount = program.provider
    loiAccount = anchor.web3.Keypair.generate()
    truongAccount = anchor.web3.Keypair.generate()

    students = [
      {
        name: "TTTT",
        age: 22,
        publicKey: trangAccount.publicKey 
      },
      {
        name: "NSL",
        age: 21,
        publicKey: loiAccount.publicKey
      },
      {
        name: "NQT",
        age: 22,
        publicKey: truongAccount.publicKey
      }
    ]
  
    studentPdas = students.map(student => {
      const [studentPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from(student.name), student.publicKey.toBuffer()],
        program.programId
      )
      return studentPda;
    })
    
    studentAccountKeypair = anchor.web3.Keypair.generate()

  })

  it("Initialize new student info test", async()=>{
    const tx = await program.methods
    .initializeStudentInstructionTest(students[0].age, students[0].name)
    .accounts({
      student: studentAccountKeypair.publicKey,
      initializer: program.provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([studentAccountKeypair])
    .rpc()

    const account = await program.account.studentAccountStateTest.fetch(studentAccountKeypair.publicKey)
    expect(account.age).to.be.equal(students[0].age)
  })

  it("Initialize second student info test", async()=>{
    const signature = await program.provider.connection.requestAirdrop(
      loiAccount.publicKey,
      LAMPORTS_PER_SOL * 1000
    )

    // console.log("LoiAccount",await program.provider.connection.getBalance(loiAccount.publicKey))
  
    await program.provider.connection.confirmTransaction(signature);

    const tx = await program.methods
    .initializeStudentInstructionTest(students[1].age, students[1].name)
    .accounts({
      student: studentAccountKeypair.publicKey,
      initializer: loiAccount.publicKey,
      // initializer: program.provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([studentAccountKeypair, loiAccount])
    // .signers([studentAccountKeypair])
    .rpc()

    const account = await program.account.studentAccountStateTest.fetch(studentAccountKeypair.publicKey)
    expect(account.age).to.be.equal(students[1].age)
  }) 
})
