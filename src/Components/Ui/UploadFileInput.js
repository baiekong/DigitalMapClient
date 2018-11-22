
import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';


// const styles = theme => ({
//     input :{
//         display:'none'
//     },
//     textField: {
//         marginLeft: theme.spacing.unit,
//         marginRight: theme.spacing.unit,
//       },
//     button: {
//       margin: theme.spacing.unit,
//     },
//     leftIcon: {
//       marginRight: theme.spacing.unit,
//     },
//     rightIcon: {
//       marginLeft: theme.spacing.unit,
//     },
//     iconSmall: {
//       fontSize: 20,
//     },
//   });
// class UploadFileInput extends React.Component {
  
//     constructor(props){
//       super(props);
//       this.state = {
//         loading : false,
//         textFileName : "",
//         files : []
//       }
//     }
//     onChange(event){
//         let files = [];
//         for(var i =0;i < event.target.files.length;i++){
//             files.push(event.target.files[i]);
//         }
//         //alert(event)
//         this.setState({
//             textFileName: event.target.value,
//             files : files
//         });
//     }
//     renderImagePreview(){
//         return (
//             Array.from(this.state.files).forEach(element =>{ 

//                return <img  id="target" src={element} /> 
//             })
//         )
//     }
//     render(){
        
//         return (
//             <div>
//                 {/* <input
//                     accept="image/*"
//                     className={this.props.classes.input}
//                     id="raised-button-file"
//                     multiple
//                     type="file"
//                     onChange={this.onChange.bind(this)}
//                 />
//                 <TextField
//                     label='Upload Picture'
//                     margin="dense"
//                     ref={this.textDisplayFile}
//                     InputLabelProps={{
//                         shrink: true,
//                       }}
//                     value={this.state.textFileName}
//                 />
//                 { this.renderImagePreview() }
//                 <label htmlFor="raised-button-file">
//                     <Button variant="raised" component="span" >
//                         <CloudUploadIcon className={this.props.classes.rightIcon} />
//                     </Button>
//                 </label>  */}
//                 <Dropzone
//                     height={20}
//                     width={50}
//                     multiple
//                     maxLength={4}
//                 >
//                 </Dropzone>
//             </div>
//         )
//     }
// }
// UploadFileInput.propTypes = {
//     classes: PropTypes.object.isRequired,
//   };

// export default withStyles(styles)(UploadFileInput);




const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  }
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };
  
  const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    extendedIcon: {
      marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
  });

  class UploadFileInput extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        maxFiles : this.props.maxFiles || 4,
        files: []
      };
      this.files =[];
    }
  
    onDrop(files) {
        if(this.files.length < this.state.maxFiles){
            this.files.push(files.map(file => ({
                    ...file,
                    name : file.name,
                    preview: URL.createObjectURL(file)
                })));
            this.setState({
                files: this.files
                });
        }
        else{
            alert("Max files input is "+this.state.maxFiles+" Please remove...")
        }
          
      
    }
    onDelete(id){
        this.files.splice(id,1);
        this.setState({
            files: this.files
        })
    }
    onHandleUploadFiles(){
        if(this.props.onHandleUploadFiles !== undefined){
            this.props.onHandleUploadFiles();
        }
        else{

        }
    }
    componentWillUnmount() {
      // Make sure to revoke the data uris to avoid memory leaks
      const {files} = this.state;
      for (let i = files.length-1; i >= 0; i--) {
        const file = files[i][0];
        URL.revokeObjectURL(file.preview);
      }
    }
  
    render() {
      const {files} = this.state;
    
    //   const listName = files.map((file,index) => (
    //     <li key={index}>{file[0].name}</li>
    //   ));
      const thumbs = files.map((file,index) => (
        <div key={index}>
            <div style={thumb} >
            <div style={thumbInner}>
                <img
                src={file[0].preview}
                style={img}
                />
                
            </div>
            </div>
            <Button variant="fab" mini aria-label="Delete" 
                color="secondary"
                className={this.props.classes.button} 
                style={{position:'absolute',marginLeft:'-35px',marginTop:'-15px'}}
                onClick={()=>{this.onDelete(index)}}
                >
                <DeleteIcon/>
            </Button>
        </div>
      ));
  
      return (
        <section style={{marginTop:'10px',marginBottom:'10px'}}>
          <div className="dropzone">
            <Dropzone
              maxLength={2}
              multiple
              accept="image/*"
              onDrop={this.onDrop.bind(this)}
              style={{position: 'relative',width: '300px', height: '50px' ,borderWidth: '2px', borderColor: 'rgb(102, 102, 102)', borderStyle: 'dashed',borderRadius:'5px'}}
            >
                <div style={{display: 'inline-block'}}>
                <span style={{width:'200px',height:'50px',margin:'5px',padding:'15px'}}>
                    Please Drop Image Here
                </span>
                <Button size="small" color="primary" aria-label="Save" >
                    Upload
                    <CloudUploadIcon className={this.props.classes.rightIcon} />
                </Button>
                </div>
            </Dropzone>
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>
            {/* <div>
                {listName}
            </div> */}
          </div>
          
        </section>
      );
    }
  }
  UploadFileInput.propTypes = {
    maxFiles: PropTypes.number,
    onHandleUploadFiles : PropTypes.func,
  };

  export default  withStyles(styles)(UploadFileInput);