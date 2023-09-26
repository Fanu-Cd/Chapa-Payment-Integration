import {Button,Input,Modal,Select,Result} from 'antd'
import { useState } from 'react'
import { UserOutlined,MailOutlined,PhoneOutlined,MoneyCollectOutlined } from '@ant-design/icons'
const {v4:uuid4} =require('uuid')

function App() {

const [modal,setModal]=useState({open:false,success:false,error:false})
const [input,setInput]=useState({fName:"",lName:"",email:"",pNumber:"",amount:"",currency:"ETB"})
const [isLoading,setIsLoading]=useState(false)

const acceptPayment=()=>{
  const tx_ref=uuid4()
  setIsLoading(true)
  fetch('http://localhost:3001/accept-payment',
  {
    method:"POST",
    body:JSON.stringify({
            "amount":input.amount,
            "currency":input.currency,
            "email":input.email,
            "first_name":input.fName,
            "last_name":input.lName,
            "phone_number":input.pNumber,
            "tx_ref":tx_ref
    }),
    headers:{'Content-Type':'application/json'}
  })
  .then(res=>res.json())
  .then((res)=>{
    setInput({fName:"",lName:"",email:"",pNumber:"",amount:"",currency:"ETB"})
    if(res.success){
      console.log("Response",res)
        setModal({...modal,success:true,open:false})
        setTimeout(() => {
          window.location.href = JSON.parse(res.success.body).data.checkout_url                
        }, 5000);
    }else{
      console.log("Error",res)
      setModal({...modal,error:true,open:false})
    }
  })
  .catch((err)=>{
     console.log("Error",err)
     setModal({...modal,error:true,open:false})
  })
}

const handleSubmit=(e)=>{
  e.preventDefault()
  acceptPayment()
}

const handleChange=(e)=>{
  const {name,value}=e.target
  setInput({
    ...input,
    [name]:value
  })
}

return (<>
          <div className='mx-auto bg-white shadow border rounded mt-5 d-flex flex-column justify-content-center align-items-center' style={{width:"60%",minHeight:"20rem",height:"auto",}}>      
            <h4 className='h4'>Welcome!</h4>      
            <Button type='primary' className='mt-2' onClick={()=>setModal({open:true})}>Pay Now With Chapa</Button>
            <Modal
                title={<p className='text-center fs-5 m-0'>Payment Details</p>}
                open={modal.open}
                maskClosable={false}
                footer={[
                  <Button key="cancel" disabled={isLoading} onClick={()=>{setModal({open:false})}} type='primary' danger>Cancel</Button>,
                  <Button key="ok" disabled={isLoading} onClick={()=>{document.getElementById('submit').click()}} type='primary'>Ok</Button>,
                ]}
             >
                <form onSubmit={handleSubmit}>
                  <label htmlFor='fname'>First Name</label>
                  <Input name='fName' value={input.fName} onChange={handleChange} prefix={<UserOutlined className="site-form-item-icon" />} id='fname' />
                  <label htmlFor='lname'>Last Name</label>
                  <Input name='lName' value={input.lName} onChange={handleChange}  prefix={<UserOutlined className="site-form-item-icon" />} id='lnane' />
                  <label htmlFor='email'>Email</label>
                  <Input name='email' value={input.email}  onChange={handleChange} type='email' prefix={<MailOutlined className="site-form-item-icon" />} id='email' />
                  <label htmlFor='pnm'>Phone Number</label>
                  <Input name='pNumber' value={input.pNumber}  onChange={handleChange} type='tel' required prefix={<PhoneOutlined className="site-form-item-icon" />} id='amt' />
                  <label htmlFor='pnm'>Amount</label>
                  <Input name='amount' value={input.amount}  onChange={handleChange} type='number' prefix={<MoneyCollectOutlined />} min='1' id='pnm' required />
                  <label htmlFor='curr'>Currency</label>
                  <Select
                      style={{ width: "100%" }}
                      className='d-block'
                      defaultValue="ETB"
                      id='curr'
                       options={[
                        { value: 'ETB', label: 'ETB' },
                        { value: 'USD', label: 'USD' },
                    ]}
                    onChange={(value)=>{setInput({...input,currency:value})}}
                  />
                  <button id='submit' hidden htmltype='submit' type='primary'></button>
                </form>
             </Modal>
             <Modal
                title={<p className='text-center fs-5 m-0'>Success</p>}
                open={modal.success}
                closable={false}
                footer=""
             >
              <Result
                status="success"
                title="Successfully Uploaded Payment Details"
                subTitle="You will be redirected to the payment page"
              />
             </Modal>
             <Modal
                title={<p className='text-center fs-5 m-0'>Error</p>}
                open={modal.error}
                closable={true}
                maskClosable={true}
                footer={[
                  <Button key="cancel" onClick={()=>{setModal({...modal,error:false})}} type='primary' danger>Cancel</Button>,
                  <Button key="ok" onClick={()=>{setModal({...modal,error:false})}} type='primary'>Continue</Button>
                ]}
             >
              <Result
                status="error"
                title="Error Uploading Payment Details"
              />
             </Modal>
          </div>
        </>
  );
  
}

export default App;
