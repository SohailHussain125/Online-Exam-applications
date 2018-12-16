import React from 'react';
import './index.css';
import { MDBView } from 'mdbreact';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import { Container, MDBAvatar, MDBCard, MDBCardBody, MDBCardUp, MDBCol, MDBRow, MDBIcon, Fa, Button, Modal, ModalBody, ModalFooter, ModalHeader, Input } from 'mdbreact';
import fire from '../../../config/firebase';


class AdminHomePanel extends React.Component {

  constructor() {

    super();

    this.state = {
      displayName: '',
      userIamge: '',
      AdminEmail: '',
      modal3: false,
      modal4: false,
      userId: '',
      successProgress: false,
      Faculties: [],
      facultyKeys: []
    }

    this.createFacultyForm = this.createFacultyForm.bind(this);
    this.entryFaculty = this.entryFaculty.bind(this);
    this.listFacultyForm = this.listFacultyForm.bind(this);

  }

  toggle(nr) {

    let modalNumber = 'modal' + nr
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });

  };


  componentWillMount() {

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
        })

        fire.database().ref(`Faculties/`).on('value', (snapshot) => {

          let facultyData = snapshot.val();
          let AdminDate = [];
          let AdminKeys = [];
          for (var key in facultyData) {
            AdminDate.push(facultyData[key]);
            AdminKeys.push(key);
          }
          this.setState({

            Faculties: AdminDate,
            facultyKeys: AdminKeys
          })

          console.log('Faculty', AdminDate);
          console.log('Faculty keys', AdminKeys);

        })

      }

    })
  }

  deleteFaculty(facultyKey, index) {

    const { userId } = this.state;

    console.log('After delete key', facultyKey[index]);

    fire.database().ref(`Faculties/${facultyKey[index]}`).remove()


  }

  extendFaculty(facultyExtend) {

    this.props.history.push(`/panel1/${facultyExtend}`);

  }

  createFacultyForm(modal3) {
    const { Faculty } = this.state;
    return (

      <Modal isOpen={this.state.modal3} toggle={() => this.toggle(3)} style={{ marginTop: '50%' }} className="cascading-modal" >
        <div className="modal-header  blue-gradient white-text">
          <h4 className="title">
            <Fa className="fa secondary-fa-pencil" icon="pencil" />Create Faculty</h4>
          <button type="button" className="close" onClick={() => this.toggle(3)}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ModalBody className=" peach-gradient" >
          <Input
            label="Create a Faculty"
            icon="pencil"
            group type="text"
            value={Faculty}
            onChange={(e) => { this.setState({ Faculty: e.target.value }) }}
            required
            validate error="wrong"
            success="right" />

        </ModalBody>
        <ModalFooter className=" peach-gradient" >
          <Button color="danger" onClick={() => this.toggle(3)}>Close</Button>
          <Button className=" blue-gradient" onClick={this.entryFaculty} >Create</Button>
        </ModalFooter>
        <ModalFooter className=" peach-gradient" >
          {this.state.successProgress ? (
            <div className="loader border-top-success  fast  moadl1Place "></div>
          ) : ("")}
        </ModalFooter>
      </Modal>

    )
  }

  listFacultyForm(modal4) {

    const { facultyKeys } = this.state;

    return (

      <Modal isOpen={this.state.modal4} toggle={() => this.toggle(4)} style={{ marginTop: '50%' }} className="cascading-modal blue-gradient" >
        <div className="modal-header purple-gradient white-text">
          <h4 className="title">
            <Fa className="fa secondary-fa-pencil" icon="reorder" />List Of Faculty</h4>
          <button type="button" className="close" onClick={() => this.toggle(4)}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ModalBody className="peach-gradient" >
          <ul >

            {this.state.Faculties.map((faculty, index) => {

              return (
                <div>
                  <li className="listItem" key={index} index={index} >{faculty.Faculty} <Button className="blue-gradient" style={{ width: '30px' }} onClick={() => this.extendFaculty(facultyKeys[index])} ><Fa icon="pencil" /></Button> <Button color="danger" onClick={() => this.deleteFaculty(facultyKeys, index)} style={{ width: '30px' }} ><Fa icon="trash"></Fa></Button> </li>
                  <br />
                </div>
              )

            })
            }
          </ul>
        </ModalBody>
        <ModalFooter className="peach-gradient" >
          <Button color="danger" onClick={() => this.toggle(4)}>Close</Button>
        </ModalFooter>
      </Modal>

    )

  }

  signOut() {

    fire.auth().signOut();
    localStorage.clear();
    this.props.history.push('/');



  }

  entryFaculty() {

    const { Faculty, userId } = this.state;

    this.setState({ successProgress: true })


    if (Faculty) {

      fire.database().ref(`Faculties/`).push({
        Faculty
      }).then(() => {
        alert("Data is Successfully entered.");
        this.setState({
          successProgress: false,
          Faculty: ''
        })


      })

    }

    else if (!Faculty) {

      this.setState({
        successProgress: false
      })

      alert("Please First Fill Input Field.");




    }
  }




  render() {

    const { displayName, userIamge, AdminEmail, modal3, modal4 } = this.state;
    return (
      <div id="apppage1" className="indigo-skin">
        <MDBView>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Card className='cardstyles shadow-box-example z-depth-5'>
                <CardHeader className='CardHeader ' />
                <Avatar className='Avatarstyle' >
                  <img className='imagestyle' width='100%' src={`${this.state.userIamge}`} height='100%' />
                </Avatar>
                <CardContent>
                  <h4 className="AdminNames">{`${this.state.displayName}`}</h4>
                  <h6 className="superAdminEmail">{`${this.state.AdminEmail}`}</h6>
                  <Button className='adminLogOutButton peach-gradient' onClick={this.signOut.bind(this)} ><Fa icon="sign-out" /> LogOut  </Button>
                </CardContent>
              </Card>

            </Grid>
            <Grid item xs={12} >
              <Card className='cardstyles1 shadow-box-example z-depth-5'>
                <CardHeader className='CardHeader1 ' />
                <CardContent>
                  <Button className='adminLogOutButton1 blue-gradient' onClick={() => this.toggle(3)} ><Fa icon="pencil" /> Create Faculty  </Button>
                </CardContent>
              </Card>
              {modal3 && this.createFacultyForm(modal3)}
            </Grid>
            <Grid item xs={12}>
              <Card className='cardstyles2 shadow-box-example z-depth-5'>
                <CardHeader className='CardHeader1 ' />
                <CardContent>
                  <Button className='adminLogOutButton1 purple-gradient' onClick={() => this.toggle(4)} ><Fa icon="reorder" /> List Of Faculty  </Button>
                </CardContent>
              </Card>
              {modal4 && this.listFacultyForm(modal4)}
            </Grid>
          </Grid>
        </MDBView>
      </div>
    )
  }
}

export default AdminHomePanel;