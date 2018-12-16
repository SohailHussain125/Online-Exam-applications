import React from 'react';
import {Animation,MDBView,Container,MDBAvatar,MDBCard,MDBCardBody,MDBCardUp,MDBCol,MDBRow,MDBIcon,Fa,Button,Modal,ModalBody,ModalFooter,ModalHeader,Input} from  'mdbreact';
import './index.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import fire from '../../../../config/firebase';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


class AdminPanel4 extends React.Component{

constructor(props){
 
super(props);

this.state={
    adminFacultyKey:props.match.params.facultyKey,
    adminYearKey:props.match.params.extendYear,
    adminSemesterKey:props.match.params.semesterKey,
    adminCourseKey:props.match.params.courseKey,
    modal11:false,
    modal12:false,
    name: 'hai',
    opt:'',
    labelWidth: 0,
    Questions:'',
    opt1:'',
    opt2:'',
    opt3:'',
    QuestionList:[],
    QuestionKey:[]

}

this.createPaperForm=this.createPaperForm.bind(this);
this.toggle=this.toggle.bind(this);
this.entryPaper=this.entryPaper.bind(this);
this.listQuestionsForm=this.listQuestionsForm.bind(this);



}

// componentWillMount(){

//  const {adminFacultyKey,adminYearKey,adminSemesterKey,adminCourseKey}=this.state;
 
//  console.log('51',adminFacultyKey);
//  console.log('52',adminYearKey);
//  console.log('53',adminSemesterKey);
//  console.log('54',adminCourseKey);


// }

componentWillMount() {
  const {adminFacultyKey,adminYearKey,adminSemesterKey,adminCourseKey}=this.state;
      fire.auth().onAuthStateChanged((user) => {
          
      if (user) {
      let displayName = user.displayName;
      let uid = user.uid;
      let url = user.photoURL;
      let email = user.email;
      fire.database().ref(`Admins/${uid}/`).on('value', (snapshot) => {
      let data = snapshot.val();
      this.setState({
      displayName: displayName,
      userId: uid,
      userIamge: url,
      AdminEmail: email,
      })
      console.log('displayname', displayName);
      console.log('uid', uid);
      console.log('url', url);
      console.log('adminfaculty',adminFacultyKey);
      console.log('adminyearkey',adminYearKey);
      console.log('adminsemseterKey',adminSemesterKey);
       })
          
       fire.database().ref(`Faculties/${adminFacultyKey}/YearWise/${adminYearKey}/Semmsters/${adminSemesterKey}/Course/${adminCourseKey}/Paper/`).on('value', (snapshot) => {
          
                    let Data = snapshot.val();
                    let PaperWiseDate = [];
                    let PaperKeys = [];
                    for (var key in Data) {
                      PaperWiseDate.push(Data[key]);
                      PaperKeys.push(key);
                    }
                    this.setState({
          
                      QuestionList: PaperWiseDate,
                      QuestionKey: PaperKeys
                    })
          
                    console.log('Faculty', PaperWiseDate);
                    console.log('Faculty keys', PaperKeys);
                    console.log('address',`Admins/${uid}/Faculties/${adminFacultyKey}/YearWise/${adminYearKey}/Semmsters/`);   
                  //   console.log('course address',`Admins/${userId}/Faculties/${adminFacultyKey}/YearWise/${adminYearKey}/Semmsters/${adminSemesterKey}/Course/`)  
          
                  })
          
                }
          
              })
  
            }


handleChange =(event)=> {
    this.setState({ opt: event.target.value });
  };


toggle(nr) {

    let modalNumber = 'modal' + nr
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });

  };

  
  entryPaper() {

    const { Questions,opt1,opt2,opt3,opt, adminFacultyKey,adminYearKey,userId,adminSemesterKey,adminCourseKey } = this.state;

    console.log('userID',userId);
    console.log('AdminFacultyKey',adminFacultyKey);
    console.log('AdminYearKey',adminYearKey);
    console.log('AdminSemeserKey',adminSemesterKey);



    this.setState({ successProgress: true })


    if (Questions && opt1 && opt2 && opt3 &&opt) {

      fire.database().ref(`Faculties/${adminFacultyKey}/YearWise/${adminYearKey}/Semmsters/${adminSemesterKey}/Course/${adminCourseKey}/Paper/`).push({
        Questions,
        options:{
            opt1,
            opt2,
            opt3,

        },
        Ans:{
            opt

        }
        
      }).then(() => {
        alert("Data is Successfully entered.");
        this.setState({
          successProgress: false,
          Questions: '',
          opt:"",
          opt1:"",
          opt2:"",
          opt3:"",

        })


      })

    }

    else if (!Questions && !opt1 && !opt2 && !opt3 && !opt) {

      this.setState({
        successProgress: false
      })

      alert("Please First Fill Input Field.");




    }
  }       
    

createPaperForm(modal11){

    const { Questions,opt1,opt2,opt3 } = this.state;
    return(
        <Modal isOpen={this.state.modal11} toggle={() => this.toggle(11)} style={{ marginTop: '50%' }} className="cascading-modal" >
        <div className="modal-header  blue-gradient white-text">
          <h4 className="title">
            <Fa className="fa secondary-fa-pencil" icon="pencil" />Create  Paper</h4>
          <button type="button" className="close" onClick={() => this.toggle(11)}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ModalBody  >

          <Input
            label="Create a Question"
            icon="pencil"
            group type="text"
            value={Questions}
            onChange={(e) => { this.setState({ Questions: e.target.value }) }}
            required
            validate error="wrong"
            success="right" />

<Input
            label="Create a option"
            icon="pencil"
            group type="text"
            name="opt1"
            value={opt1}
            onChange={(e) => { this.setState({ opt1: e.target.value }) }}
            required
            validate error="wrong"
            success="right" />

<Input
            label="Create a option"
            icon="pencil"
            name="opt2"
            group type="text"
            value={opt2}
            onChange={(e) => { this.setState({ opt2: e.target.value }) }}
            required
            validate error="wrong"
            success="right" />

<Input
            label="Create a option"
            icon="pencil"
            group type="text"
            name="opt3"
            value={opt3}
            onChange={(e) => { this.setState({ opt3: e.target.value }) }}
            required
            validate error="wrong"
            success="right" />

<Select      style={{width:'90%',marginLeft:'10%'}}   
            value={this.state.opt}
            onChange={this.handleChange}
            placeholder="Choose Correct answer"
            inputProps={{
              name: 'age',
              id: 'age-simple',
            }}
          >
            
            <MenuItem value="opt1">opt1</MenuItem>
            <MenuItem value="opt2">opt2</MenuItem>
            <MenuItem value="opt3">opt3</MenuItem>
          </Select>

    
        </ModalBody>
        <ModalFooter  >
          <Button color="danger" onClick={() => this.toggle(11)}>Close</Button>
          <Button className=" blue-gradient" onClick={this.entryPaper} >Create</Button>
        </ModalFooter>
        <ModalFooter  >
          {this.state.successProgress ? (
            <div className="loader border-top-success  fast  moadl1Place "></div>
          ) : ("")}
        </ModalFooter>
      </Modal>
    )
    
    } 

    listQuestionsForm(modal12) {

      const { adminSemesterKey,adminFacultyKey,adminYearKey,QuestionKey } = this.state;
      
      return (
      
      <Modal isOpen={this.state.modal12} toggle={() => this.toggle(12)} style={{ marginTop: '50%' }} className="cascading-modal blue-gradient" >
      <div className="modal-header purple-gradient white-text">
      <h4 className="title">
      <Fa className="fa secondary-fa-reorder" icon="reorder" />List Of Questions</h4>
      <button type="button" className="close" onClick={() => this.toggle(12)}>
      <span aria-hidden="true">×</span>
      </button>
      </div>
      <ModalBody  >
      <ul >
       {this.state.QuestionList.map((question, index) => {
      
      return (
      <div>
      <li style={{marginLeft:'2%'}} className="listItem" key={index} index={index} >{question.Questions} <Button className="blue-gradient" style={{ width: '30px' }} onClick={() => this.extendCourse(QuestionKey[index],adminFacultyKey,adminYearKey,adminSemesterKey)} ><Fa icon="pencil" /></Button> <Button color="danger" onClick={() => this.deleteCourse(QuestionKey, index)} style={{ width: '30px' }} ><Fa icon="trash"></Fa></Button> </li>
      <br />
      </div>
      )
      })
      } 
      </ul>
      </ModalBody>
      <ModalFooter  >
      <Button color="danger" onClick={() => this.toggle(12)}>Close</Button>
      </ModalFooter>
      </Modal>
       )
       }             




render(){
const { modal11,modal12 } = this.state;

return(

    <div id="apppage5" ><MDBView><Grid container spacing={24}>
    <Grid item xs={12}>
    <Card className='cardstyles shadow-box-example z-depth-5'>
    <CardHeader className='CardHeader9 ' />
    <CardContent>
     <Animation type="rotateInUpRight" duration="4s" infinite>   
     <h4 className="AdminNames3">OnLine Examination Application</h4>
     </Animation>
    
    </CardContent>
    </Card>
  
    </Grid>
     <Grid item xs={12} >
     <Card className='cardstyles4 shadow-box-example z-depth-5'>
    <CardHeader className='CardHeader10 ' />
    <CardContent>
    <Button className='adminLogOutButton4 blue-gradient' onClick={()=>this.toggle(11)} ><Fa icon="pencil" /> Create  Paper  </Button>  
    </CardContent>
    </Card>
    {modal11 && this.createPaperForm(modal11)}
    </Grid>
    <Grid item xs={12}>
    <Card className='cardstyles3 shadow-box-example z-depth-5'>
    <CardHeader className='CardHeader10' />
    <CardContent>
    <Button className='adminLogOutButton4 purple-gradient' onClick={()=>this.toggle(12)} ><Fa icon="reorder" /> List Of  Paper </Button>  
    </CardContent>
    </Card>
    {modal12 && this.listQuestionsForm(modal12)}
    </Grid> 
    </Grid> 
 </MDBView></div>
)    

}    

}

export default AdminPanel4;