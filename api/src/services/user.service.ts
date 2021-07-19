import Router from 'express';
import { UserRepository } from '../repositories/user.repository';
import provaMedio from '../static/medio.json';
import provaFundamental from '../static/fundamental.json';

const userService = Router();
const rep = new UserRepository();

function minutesToMiliseconds(t: number) {
    return t * 60 * 1000;
}

function getCurrentExamStatus(modalidade: string) {
    const now = new Date();
    const exam = modalidade == 'medio' ? provaMedio : provaFundamental;
    const examStart = new Date(exam['startDate']);
    const examEnd = new Date(examStart.getTime() + minutesToMiliseconds(exam['durationInMinutes']));

    if (now >= examStart && now <= examEnd) {
        return 1;
    }

    return now < examStart ? 0 : 2;
}

function clearAnswersFromExam(exam:any){
    for (let i = 0; i < exam['questions'].length; i++){
        delete exam['questions'][i]['answer'];
    }
    return exam;
}

userService.get('/', async (req, res) => {
    const ra = req.query.ra, cpf = req.query.cpf;
    const user: any = await rep.findOneUser(ra);
    if (!user) {
        res.send({ 'error': 'RA não cadastrado' })
        return;
    }

    if (user.cpf != cpf) {
        res.send({ 'error': 'CPF mismatch' });
        return;
    }

    //Modalidade:Number
    //0=>Fundamental
    //1=>Medio
    const modalidade = user.modalidade == 1 ? 'medio' : 'fundamental';

    //Status:Number
    //0=>Pré tempo de prova
    //1=>Durante a prova
    //2=>Já passou do tempo
    var status = getCurrentExamStatus(modalidade);

    const provaObject = clearAnswersFromExam(modalidade == 'medio' ? provaMedio : provaFundamental);

    if (status !== 1) {
        provaObject['questions'] = [];
        provaObject['error'] = status ? 'post_exam' : 'pre_exam';
    }

    res.send({
        name: user.name,
        modalidade,
        status,
        prova: provaObject
    })
});

userService.post('/', async (req, res) => {
    const ra = req.body.ra, cpf = req.body.cpf;
    const resposta = req.body.resposta;
    const user: any = await rep.findOneUser(ra);
    if (!user) {
        res.status(404);
        res.send('RA não cadastrado');
        return;
    }

    if (user.cpf != cpf) {
        res.status(404);
        res.send('CPF mismatch');
        return;
    }

    //Modalidade:Number
    //0=>Fundamental
    //1=>Medio
    const modalidade = user.modalidade == 1 ? 'medio' : 'fundamental';

    //Status:Number
    //0=>Pré tempo de prova
    //1=>Durante a prova
    //2=>Já passou do tempo
    var status = getCurrentExamStatus(modalidade);

    if (status !== 1) {
        res.send({ 'error': (status ? 'post_exam' : 'pre_exam') });
        return;
    }

    resposta['submissionTime'] = new Date();
    const response = await rep.updateOneUser(ra, resposta);

    if (response.ok === 1 && response.nModified === 1){
        res.sendStatus(200);
        return;
    }

    res.status(500);
    res.send("Internal server error! :(");
});

export default userService