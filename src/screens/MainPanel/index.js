import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {Fa,Input, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBMask,
MDBRow, MDBCol, MDBBtn, MDBView, MDBContainer, MDBFormInline ,Button,Tooltip,Popover,PopoverBody,PopoverHeader,Modal,ModalBody,ModalFooter,ModalHeader} from "mdbreact";
import './index.css';
import fire from '../../config/firebase';


class MainPanel extends React.Component {
constructor(props){ 
super(props)       
this.state = {
  collapsed: false,
  modal1: false,
  successProgress:false,
  modal2:false

};

this.toggle=this.toggle.bind(this);
this.handleTogglerClick=this.handleTogglerClick.bind(this);
this.signUpForm=this.signUpForm.bind(this);
this.LogInForm=this.LogInForm.bind(this);


}
toggle(nr) {
    let modalNumber = 'modal' + nr
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  };
handleTogglerClick(){
this.setState({
  collapsed: !this.state.collapsed
});
};

getAdminData(){
const { adminName ,adminEmail,adminPassword,adminProfile} = this.state;

if(adminName && adminEmail && adminPassword && adminProfile ){
this.setState({
successProgress:true
})
  
fire.auth().createUserWithEmailAndPassword(adminEmail,adminPassword).then((User)=>{ 
let userid=User.user.uid;
fire.storage().ref(`image/${userid}/${adminProfile.name}`).put(adminProfile).then(function(user){
  fire.storage().ref(`image/${userid}/${adminProfile.name}`).getDownloadURL().then(function(url){
console.log('---SignUp Url',url);
fire.auth().currentUser.updateProfile({
displayName:adminName,
photoURL:url
}).then(()=>{
  fire.database().ref(`Admins/${userid}/`).set({
  adminName,
  adminEmail,
  url
  })
        
        })
      })
    })
  }).then(()=>{
    this.setState({
      adminName:'',
      adminEmail:'',
      adminPassword:'',
      adminProfile:'',
      successProgress:false
    
    })
  
    alert('Successfully Registered Admin');
    
  })
  
  }

}

AdminLoggedIn(){

  this.setState({
    successProgress: true
  })
 const { adminEmail,adminPassword } = this.state;

  fire.auth().signInWithEmailAndPassword(adminEmail, adminPassword).then((user) => {

    console.log('userDetails', user);
    let uid = user.user.uid;
    let Name =user.user.displayName;
    let url =user.user.photoURL;
    fire.database().ref(`Admins/${uid}/`).on('value', (snapshot) => {
      let data = snapshot.val();
      console.log(data)
      console.log(Name,url);
        console.log('----------- uid' + uid);
        this.setState({
          successProgress:false,
          adminEmail:'',
          adminPassword:''
        })
        alert('successfully Admin LogIn !');
        this.props.history.push('/adminHomePanel');

    })

  })
}

LogInForm(modal2){
 
  const { adminEmail,adminPassword } = this.state;

  return(
    <Modal className='modal1' isOpen={this.state.modal2} toggle={() => this.toggle(2)} style={{marginTop:'50%'}}  className="cascading-modal" >
    <div className="modal-header primary-color white-text">
    <h4 className="title">
    <Fa className="fa secondary-fa-pencil" />Admin LogIn Form</h4>
    <button type="button" className="close" onClick={()=> this.toggle(2)}>
    <span aria-hidden="true">×</span>
    </button>
    </div>
    <ModalBody className='peach-gradient'>
    <Input 
    label="Your email" 
    icon="envelope" 
    group type="email"
    required 
    value={adminEmail}
    onChange={(e)=>{this.setState({adminEmail:e.target.value})}}
    validate error="wrong" 
    success="right"/>
    <Input 
    label="Your password" 
    icon="lock" 
    group type="password"
    required
    value={adminPassword}
    onChange={(e)=>{this.setState({adminPassword:e.target.value})}} 
    validate/>
    </ModalBody>
    <ModalFooter className='peach-gradient'>
    <Button color="danger" onClick={() => this.toggle(2)}>Close</Button>
    <Button className="blue-gradient" onClick={this.AdminLoggedIn.bind(this)}>LogIn</Button>
    </ModalFooter>
    <ModalFooter className='peach-gradient'>
    {this.state.successProgress ?(
      <div className="loader border-top-success fast moadl1Place "></div>
    ):("")}
    </ModalFooter>
    </Modal>
    
    )
    
}


signUpForm(modal1){

  const { adminName,adminEmail,adminPassword,adminProfile } = this.state;

return(
<Modal className='modal1' isOpen={this.state.modal1} toggle={() => this.toggle(1)} style={{marginTop:'50%'}}  className="cascading-modal" >
<div className="modal-header primary-color white-text">
<h4 className="title">
<Fa className="fa secondary-fa-pencil" />Admin Registration</h4>
<button type="button" className="close" onClick={()=> this.toggle(1)}>
<span aria-hidden="true">×</span>
</button>
</div>
<ModalBody className='peach-gradient'>
<Input 
label="Your name" 
icon="user" 
group type="text"
required 
value={adminName}
onChange={(e)=>{this.setState({adminName:e.target.value})}}
validate error="wrong" 
success="right"/>
<Input 
label="Your email" 
icon="envelope" 
group type="email"
required 
value={adminEmail}
onChange={(e)=>{this.setState({adminEmail:e.target.value})}}
validate error="wrong" 
success="right"/>
<Input 
label="Your password" 
icon="lock" 
group type="password"
required
value={adminPassword}
onChange={(e)=>{this.setState({adminPassword:e.target.value})}} 
validate/>
<Input 
icon='upload' 
group type='file' 
required
onChange={(e)=>{this.setState({adminProfile:e.target.files[0]})}} 
 />
</ModalBody>
<ModalFooter className='peach-gradient'>
<Button color="danger" onClick={() => this.toggle(1)}>Close</Button>
<Button className="blue-gradient"onClick={this.getAdminData.bind(this)}>Register</Button>
</ModalFooter>
<ModalFooter className='peach-gradient'>
    {this.state.successProgress ?(
      <div className="loader  border-top-success fast moadl1Place "></div>
    ):("")}
    </ModalFooter>

</Modal>

)

}

render() {
 const { modal1,modal2 } = this.state;   
const overlay = (
  <div id="sidenav-overlay" style={{ backgroundColor: "transparent" }} onClick={this.handleTogglerClick} />
);
return (
<div id="apppage">
<Router>
<div>
<MDBNavbar color="primary-color" dark expand="md" fixed="top" scrolling transparent>
<MDBContainer>
<MDBNavbarBrand>
<strong className="white-text" style={{fontFamily:'georgia'}}>Online Exam Application</strong>
</MDBNavbarBrand>
<MDBNavbarToggler onClick={this.handleTogglerClick} />
<MDBCollapse isOpen={this.state.collapsed} navbar>
<MDBNavbarNav left>
<MDBNavItem active>
<MDBNavLink to="/">Home</MDBNavLink>
</MDBNavItem>
<MDBNavItem>
<MDBNavLink  to="/" onClick={()=>this.toggle(1)}>Admin SignUp</MDBNavLink>
{modal1 && this.signUpForm(modal1)}
</MDBNavItem>
<MDBNavItem>
<MDBNavLink to="/" onClick={()=>this.toggle(2)}>Admin LogIn</MDBNavLink>
{modal2 && this.LogInForm(modal2)}
</MDBNavItem>
</MDBNavbarNav>
<MDBNavbarNav right>
<MDBNavItem>
<MDBFormInline waves>
<div className="md-form my-0">
    <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
    </div>
</MDBFormInline>
</MDBNavItem>
</MDBNavbarNav>
</MDBCollapse></MDBContainer>
</MDBNavbar>
{this.state.collapsed && overlay}
</div>
</Router>
<MDBView>
<MDBMask className="d-flex justify-content-center align-items-center gradient">
<MDBContainer>
<MDBRow>
<div className="white-text text-center text-md-left col-md-6 mt-xl-5 mb-5">
<h1 className="h1-responsive font-weight-bold mt-sm-5" style={{fontFamily:'cambria',fontSize:'30px'}}>
Make purchases with our app{" "}
</h1>
<hr className="hr-light"  />
<h6 className="mb-4" >
Lorem ipsum dolor sit amet, consectetur adipisicing elit.
Rem repellendus quasi fuga nesciunt dolorum nulla magnam
veniam sapiente, fugiat! Commodi sequi non animi ea dolor
molestiae iste.
</h6>
<MDBBtn outline color="white">
Learn More
</MDBBtn>
</div>
</MDBRow>
</MDBContainer>
</MDBMask>
</MDBView> 
</div>
);
}
}

export default MainPanel;