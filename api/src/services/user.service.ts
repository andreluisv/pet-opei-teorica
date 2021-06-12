import Router from 'express';
import {UserRepository} from '../repositories/user.repository';

const menuService = Router();
const rep = new UserRepository();

menuService.get('/',async(req,res)=>{
    const ra = req.query.ra, cpf = req.query.cpf;
    const user : any = await rep.findOneUser(ra);
    console.log(user);
    if (!user){
        res.send({'error':'RA não cadastrado'})
        return;
    }

    if (user.cpf != cpf){
        res.send({'error':'CPF mismatch'});
        return;
    }

    //Modalidade:Number
    //0=>Fundamental
    //1=>Medio
    const modalidade = user.modalidade==1 ? 'medio' : 'fundamental';

    //Status:Number
    //0=>Prova liberada
    //1=>Ainda não começou
    //2=>Já passou do tempo
    var status = 0;

    res.send({
        name: user.name,
        modalidade,
        status,
        prova:{}
    })
})

export default menuService