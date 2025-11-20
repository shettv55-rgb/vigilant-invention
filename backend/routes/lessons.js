const express=require("express"); const router=express.Router();
router.get("/:id",(req,res)=>res.json({course:req.params.id,lessons:["Aula 1","Aula 2"]}));
module.exports=router;