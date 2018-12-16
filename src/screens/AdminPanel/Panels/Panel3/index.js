import React from 'react';
import './index.css';
import {Animation,MDBView,Container,MDBAvatar,MDBCard,MDBCardBody,MDBCardUp,MDBCol,MDBRow,MDBIcon,Fa,Button,Modal,ModalBody,ModalFooter,ModalHeader,Input} from  'mdbreact';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import fire from '../../../../config/firebase';



class AdminPanel3 extends React.Component{
constructor(props){
super(props);
this.state={
  adminFacultyKey:props.match.params.facultyKey,
    adminYearKey:props.match.params.extendYear,
    adminSemesterKey:props.match.params.semesterKey,
    modal9:false,
    modal10:false,
    Course:'',
    userId:'',
    Courses:[],
    CourseKey:[]
}

this.createCourseForm=this.createCourseForm.bind(this);
this.toggle=this.toggle.bind(this);
this.entryCourse=this.entryCourse.bind(this);
this.listCourseForm=this.listCourseForm.bind(this);


}

componentWillMount() {
    const {adminFacultyKey,adminYearKey,adminSemesterKey}=this.state;
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
            
         fire.database().ref(`Faculties/${adminFacultyKey}/YearWise/${adminYearKey}/Semmsters/${adminSemesterKey}/Course/`).on('value', (snapshot) => {
            
                      let Data = snapshot.val();
                      let CourseWiseDate = [];
                      let CourseKeys = [];
                      for (var key in Data) {
                        CourseWiseDate.push(Data[key]);
                        CourseKeys.push(key);
                      }
                      this.setState({
            
                        Courses: CourseWiseDate,
                        CourseKey: CourseKeys
                      })
            
                      console.log('Faculty', CourseWiseDate);
                      console.log('Faculty keys', CourseKeys);
                      console.log('address',`Admins/${uid}/Faculties/${adminFacultyKey}/YearWise/${adminYearKey}/Semmsters/`);   
                    //   console.log('course address',`Admins/${userId}/Faculties/${adminFacultyKey}/YearWise/${adminYearKey}/Semmsters/${adminSemesterKey}/Course/`)  
            
                    })
            
                  }
            
                })
    
              }

              extendCourse(CourseKey1,adminFacultyKey,adminYearKey,adminSemesterKey){

                this.props.history.push(`/panel4/${CourseKey1}/${adminSemesterKey}/${adminYearKey}/${adminFacultyKey}`);
                console.log('89',CourseKey1);
                console.log('90',adminFacultyKey);
              }  

              deleteCourse(CourseKey1, index) {

                const { userId,adminFacultyKey,adminYearKey,adminSemesterKey } = this.state;
                    
                
                    
                fire.database().ref(`Faculties/${adminFacultyKey}/YearWise/${adminYearKey}/Semmsters/${adminSemesterKey}/Course/${CourseKey1[index]}`).remove()
                    
                    
                      }  
                       

              entryCourse() {

                const { Course, adminFacultyKey,adminYearKey,userId,adminSemesterKey } = this.state;
            
                console.log('userID',userId);
                console.log('AdminFacultyKey',adminFacultyKey);
                console.log('AdminYearKey',adminYearKey);
                console.log('AdminSemeserKey',adminSemesterKey);



                this.setState({ successProgress: true })
            
            
                if (Course) {
            
                  fire.database().ref(`Faculties/${adminFacultyKey}/YearWise/${adminYearKey}/Semmsters/${adminSemesterKey}/Course/`).push({
                    Course
                  }).then(() => {
                    alert("Data is Successfully entered.");
                    this.setState({
                      successProgress: false,
                      Course: ''
                    })
            
            
                  })
            
                }
            
                else if (!Course) {
            
                  this.setState({
                    successProgress: false
                  })
            
                  alert("Please First Fill Input Field.");
            
            
            
            
                }
              }       
                

              listCourseForm(modal10) {

                const {CourseKey, adminSemesterKey,adminFacultyKey,adminYearKey } = this.state;
                
                return (
                
                <Modal isOpen={this.state.modal10} toggle={() => this.toggle(10)} style={{ marginTop: '50%' }} className="cascading-modal blue-gradient" >
                <div className="modal-header purple-gradient white-text">
                <h4 className="title">
                <Fa className="fa secondary-fa-reorder" icon="reorder" />List Of Course</h4>
                <button type="button" className="close" onClick={() => this.toggle(10)}>
                <span aria-hidden="true">×</span>
                </button>
                </div>
                <ModalBody  >
                <ul >
                 {this.state.Courses.map((course, index) => {
                
                return (
                <div>
                <li style={{marginLeft:'2%'}} className="listItem" key={index} index={index} >{course.Course} <Button className="blue-gradient" style={{ width: '30px' }} onClick={() => this.extendCourse(CourseKey[index],adminFacultyKey,adminYearKey,adminSemesterKey)} ><Fa icon="pencil" /></Button> <Button color="danger" onClick={() => this.deleteCourse(CourseKey, index)} style={{ width: '30px' }} ><Fa icon="trash"></Fa></Button> </li>
                <br />
                </div>
                )
                })
                } 
                </ul>
                </ModalBody>
                <ModalFooter  >
                <Button color="danger" onClick={() => this.toggle(10)}>Close</Button>
                </ModalFooter>
                </Modal>
                 )
                 }             

createCourseForm(modal9){

    const { Course } = this.state;
    return(
        <Modal isOpen={this.state.modal9} toggle={() => this.toggle(9)} style={{ marginTop: '50%' }} className="cascading-modal" >
        <div className="modal-header  blue-gradient white-text">
          <h4 className="title">
            <Fa className="fa secondary-fa-pencil" icon="pencil" />Create  Course</h4>
          <button type="button" className="close" onClick={() => this.toggle(9)}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ModalBody  >
          <Input
            label="Create a Course"
            icon="pencil"
            group type="text"
            value={Course}
            onChange={(e) => { this.setState({ Course: e.target.value }) }}
            required
            validate error="wrong"
            success="right" />
    
        </ModalBody>
        <ModalFooter  >
          <Button color="danger" onClick={() => this.toggle(9)}>Close</Button>
          <Button className=" blue-gradient" onClick={this.entryCourse} >Create</Button>
        </ModalFooter>
        <ModalFooter  >
          {this.state.successProgress ? (
            <div className="loader border-top-success  fast  moadl1Place "></div>
          ) : ("")}
        </ModalFooter>
      </Modal>
    )
    
    } 

  
toggle(nr) {

    let modalNumber = 'modal' + nr
    this.setState({
    [modalNumber]: !this.state[modalNumber]
    });
     }; 


render(){
    const {adminSemesterKey,modal9,modal10 }=this.state;
 return(
   <div id="apppage4"><MDBView>
<Grid container spacing={24}>
   <Grid item xs={12}>
   <Card className='cardstyles shadow-box-example z-depth-5'>
   <CardHeader className='CardHeader8 ' />
   <CardContent>
    <Animation type="lightSpeedIn" duration="4s" infinite>   
    <h4 className="AdminNames3">OnLine Examination Application</h4>
    </Animation>
   
   </CardContent>
   </Card>
 
   </Grid>
    <Grid item xs={12} >
    <Card className='cardstyles4 shadow-box-example z-depth-5'>
   <CardHeader className='CardHeader7 ' />
   <CardContent>
   <Button className='adminLogOutButton4 blue-gradient' onClick={()=>this.toggle(9)} ><Fa icon="pencil" /> Create  Course  </Button>  
   </CardContent>
   </Card>
   {modal9 && this.createCourseForm(modal9)}
   </Grid>
   <Grid item xs={12}>
   <Card className='cardstyles3 shadow-box-example z-depth-5'>
   <CardHeader className='CardHeader7 ' />
   <CardContent>
   <Button className='adminLogOutButton4 purple-gradient' onClick={()=>this.toggle(10)} ><Fa icon="reorder" /> List Of  Course </Button>  
   </CardContent>
   </Card>
   {modal10 && this.listCourseForm(modal10)}
   </Grid> 
   </Grid> 

       </MDBView></div>  
 )   
}
}

export default AdminPanel3;