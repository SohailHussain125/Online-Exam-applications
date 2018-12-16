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

class AdminPanel2 extends React.Component{

constructor(props){
super(props);
this.state={
    adminYearKey:props.match.params.extendYear,
    adminFacultykey:props.match.params.facultyKey,
    modal7:false,
    modal8:false,
    Semmster:'',
    userId:'',
    SemmsterWise:[],
    SemmsterKey:[]
}
this.toggle=this.toggle.bind(this);
this.createSemmsterForm=this.createSemmsterForm.bind(this);
this.listSemmsterForm=this.listSemmsterForm.bind(this);
this.entrySemmster=this.entrySemmster.bind(this);

}

componentWillMount() {
const {userId,adminFacultykey,adminYearKey}=this.state;
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
    console.log('adminfaculty',adminFacultykey);
    console.log('adminyearkey',adminYearKey);
     })
        
     fire.database().ref(`Faculties/${adminFacultykey}/YearWise/${adminYearKey}/Semmsters/`).on('value', (snapshot) => {
        
                  let Data = snapshot.val();
                  let SemmsterWiseDate = [];
                  let SemmsterKeys = [];
                  for (var key in Data) {
                    SemmsterWiseDate.push(Data[key]);
                    SemmsterKeys.push(key);
                  }
                  this.setState({
        
                    SemmsterWise: SemmsterWiseDate,
                    SemmsterKey: SemmsterKeys
                  })
        
                  console.log('Faculty', SemmsterWiseDate);
                  console.log('Faculty keys', SemmsterKeys);
                  console.log('address',`Admins/${uid}/Faculties/${adminFacultykey}/YearWise/${adminYearKey}/Semmsters/`);   

        
                })
        
              }
        
            })

          }


extendSemester(SemmsterKey1,adminFacultykey,adminYearKey){

  this.props.history.push(`/panel3/${SemmsterKey1}/${adminYearKey}/${adminFacultykey}`);
  console.log('89',SemmsterKey1);
  console.log('90',adminFacultykey);
} 

deleteSemmster(semmster, index) {

  const { userId,adminFacultykey,adminYearKey,adminSemesterKey } = this.state;
      
  
      
  fire.database().ref(`Faculties/${adminFacultykey}/YearWise/${adminYearKey}/Semmsters/${semmster[index]}`).remove()
      
      
        }  

toggle(nr) {

    let modalNumber = 'modal' + nr
    this.setState({
    [modalNumber]: !this.state[modalNumber]
    });
     };
 
     listSemmsterForm(modal8) {

        const { SemmsterKey,adminFacultykey,adminYearKey } = this.state;
        
        return (
        
        <Modal isOpen={this.state.modal8} toggle={() => this.toggle(8)} style={{ marginTop: '50%' }} className="cascading-modal blue-gradient" >
        <div className="modal-header purple-gradient white-text">
        <h4 className="title">
        <Fa className="fa secondary-fa-reorder" icon="reorder" />List Of  Semester</h4>
        <button type="button" className="close" onClick={() => this.toggle(8)}>
        <span aria-hidden="true">×</span>
        </button>
        </div>
        <ModalBody  >
        <ul >
         {this.state.SemmsterWise.map((semmster, index) => {
        
        return (
        <div>
        <li style={{marginLeft:'2%'}} className="listItem" key={index} index={index} >{semmster.Semmster} <Button className="blue-gradient" style={{ width: '30px' }} onClick={() => this.extendSemester(SemmsterKey[index],adminFacultykey,adminYearKey)} ><Fa icon="pencil" /></Button> <Button color="danger" onClick={() => this.deleteSemmster(SemmsterKey, index)} style={{ width: '30px' }} ><Fa icon="trash"></Fa></Button> </li>
        <br />
        </div>
        )
        })
        } 
        </ul>
        </ModalBody>
        <ModalFooter  >
        <Button color="danger" onClick={() => this.toggle(8)}>Close</Button>
        </ModalFooter>
        </Modal>
         )
         }

         entrySemmster() {

            const { Semmster, adminFacultykey,adminYearKey,userId } = this.state;
        
            this.setState({ successProgress: true })
        
        
            if (Semmster) {
        
              fire.database().ref(`Faculties/${adminFacultykey}/YearWise/${adminYearKey}/Semmsters/`).push({
                Semmster
              }).then(() => {
                alert("Data is Successfully entered.");
                this.setState({
                  successProgress: false,
                  Semmster: ''
                })
        
        
              })
        
            }
        
            else if (!Semmster) {
        
              this.setState({
                successProgress: false
              })
        
              alert("Please First Fill Input Field.");
        
        
        
        
            }
          }       
            

     createSemmsterForm(modal7){

        const { Semmster } = this.state;
        
        return(
            <Modal isOpen={this.state.modal7} toggle={() => this.toggle(7)} style={{ marginTop: '50%' }} className="cascading-modal" >
            <div className="modal-header  blue-gradient white-text">
              <h4 className="title">
                <Fa className="fa secondary-fa-pencil" icon="pencil" />Create  Semester</h4>
              <button type="button" className="close" onClick={() => this.toggle(7)}>
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <ModalBody  >
              <Input
                label="Create a Semmster"
                icon="pencil"
                group type="text"
                value={Semmster}
                onChange={(e) => { this.setState({ Semmster: e.target.value }) }}
                required
                validate error="wrong"
                success="right" />
        
            </ModalBody>
            <ModalFooter  >
              <Button color="danger" onClick={() => this.toggle(7)}>Close</Button>
              <Button className=" blue-gradient" onClick={this.entrySemmster} >Create</Button>
            </ModalFooter>
            <ModalFooter  >
              {this.state.successProgress ? (
                <div className="loader border-top-success  fast  moadl1Place "></div>
              ) : ("")}
            </ModalFooter>
          </Modal>
        )
        
        } 
     
render(){
 
 const {modal7,modal8} = this.state;   
    
return(

   <div  id="apppage3" ><MDBView><Grid container spacing={24}>
   <Grid item xs={12}>
   <Card className='cardstyles shadow-box-example z-depth-5'>
   <CardHeader className='CardHeader6  ' />
   <CardContent>
    <Animation type="zoomInLeft" duration="4s" infinite>   
    <h4 className="AdminNames2">OnLine Examination Application</h4>
    </Animation>
   {/*<h6 className="superAdminEmail">{`${this.state.AdminEmail}`}</h6>
   <Button className='adminLogOutButton peach-gradient' onClick={this.signOut.bind(this)} ><Fa icon="sign-out" /> LogOut  </Button>   */}
   </CardContent>
   </Card>
 
   </Grid>
    <Grid item xs={12} >
    <Card className='cardstyles4 shadow-box-example z-depth-5'>
   <CardHeader className='CardHeader5 ' />
   <CardContent>
   <Button className='adminLogOutButton2 blue-gradient' onClick={()=>this.toggle(7)} ><Fa icon="pencil" /> Create  Semester  </Button>  
   </CardContent>
   </Card>
   {modal7 && this.createSemmsterForm(modal7)}
   </Grid>
   <Grid item xs={12}>
   <Card className='cardstyles3 shadow-box-example z-depth-5'>
   <CardHeader className='CardHeader5 ' />
   <CardContent>
   <Button className='adminLogOutButton3 purple-gradient' onClick={()=>this.toggle(8)} ><Fa icon="reorder" /> List Of  Semester </Button>  
   </CardContent>
   </Card>
   {modal8 && this.listSemmsterForm(modal8)}
   </Grid> 
   </Grid></MDBView></div> 
)    
}    

}

export default AdminPanel2;