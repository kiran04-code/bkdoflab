import JWT  from "jsonwebtoken"
const JWTSCREATE = "SIGN@9090"
export const createToken = async(user)=>{
 const paylaod = {
    _id:user._id, 
 }

 const token = await JWT.sign(paylaod,JWTSCREATE);
 return token;


}

export const getvalidData = (token)=>{
const paylod =  JWT.verify(token,JWTSCREATE)
return paylod
}