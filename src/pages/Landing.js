import MaterialTable from 'material-table';
import { black } from 'material-ui/styles/colors';
import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import XLSX from 'xlsx';
// import MaterialTable from 'material-table';

const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background: black;
    display: inline-block;
`;

const ContainerBottom = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 70vh;
    margin-top: 100px;
`;

const TextHeading = styled.h1`
    font-size: 3rem;
    text-align: center;
    margin: 20px;
    ${'' /* padding: 10px; */}
    color: white;
    
`;

const TextBanner = styled.h1`
    font-size: 1.6rem;
    text-align: center;
    margin: 80px;
    ${'' /* padding: 10px; */}
    color: white;
    
`;

const Input = styled.input`
    text-align: center;
    background: #202124;
    border: none;
    color: white;
    border-radius: 8px;
    font-size: 1rem;
    padding: 4px;
    &::file-selector-button {
        border: none;
        padding: .2em .4em;
        border-radius: 9px;
        background-color: black;
        transition: 1s;
        color: white;
        cursor: pointer;
    }
`;

const EXTENSIONS = ['xlsx', 'xls', 'csv'];

function Landing() {

    const [colDefs, setColDefs] = useState();
    const [data, setData] = useState();
    const [name, setName]= useState();


    const getExention = (file) => {
        const parts = file.name.split('.')
        const extension = parts[parts.length - 1]
        return EXTENSIONS.includes(extension)
      }
    
      const convertToJson = (headers, data) => {
        const rows = []
        data.forEach(row => {
          let rowData = {}
          row.forEach((element, index) => {
            rowData[headers[index]] = element
          })
          rows.push(rowData)
    
        });
        return rows
      }
    
      const importExcel = (e) => {
        const file = e.target.files[0]
        console.log(file);
        setName(file.name);
    
        const reader = new FileReader()
        reader.onload = (event) => {
         
    
          const bstr = event.target.result
          const workBook = XLSX.read(bstr, { type: "binary" })
    
          
          const workSheetName = workBook.SheetNames[0]
          const workSheet = workBook.Sheets[workSheetName]
          
          const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
         
          const headers = fileData[0]
          const heads = headers.map(head => ({ title: head, field: head }))
          setColDefs(heads)
    
         
          fileData.splice(0, 1)
    
    
          setData(convertToJson(headers, fileData))
        }
    
        if (file) {
          if (getExention(file)) {
            reader.readAsBinaryString(file)
          }
          else {
            alert("Invalid file")
          }
        } else {
          setData([])
          setColDefs([])
        }
      }

    return (
        <div>
            <Container>
                <TextHeading>Excel Reader</TextHeading>
                <TextBanner> Please click on the button below to choose a file</TextBanner>
                <ContainerBottom>
                    <Input type="file" onChange={importExcel} />

                    <MaterialTable options={{
        headerStyle: {
            border: '3px solid black',
          backgroundColor: '#202124',
          color: '#fff'
        },
        rowStyle: {
            border: '3px solid black',
          backgroundColor: '#EEE',
        },
        colStyle:{
            border: '3px solid black'
        }
      }} style={{width: '90%', margin: '50px', fontWeight: 'bolder'}} title={name? name: 'Excel File Not Chosen'} data={data} columns = {colDefs} />
                </ContainerBottom>
            </Container>
        </div>
    )
}

export default Landing
