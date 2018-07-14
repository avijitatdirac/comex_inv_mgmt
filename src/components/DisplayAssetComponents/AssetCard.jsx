import React, { Component } from 'react'

import { Divider, Icon, Form } from 'semantic-ui-react'
import {Card, Button, Input, List, Label} from 'semantic-ui-react'

class AssetCard  extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isSelected: false
    }
  }

  render() {
    return (
      <Card color="grey">
      
      {(this.props.item.extras !== undefined) ? <Label as='a' color='red'>Modded</Label> : undefined}
      <Card.Content>
        <Card.Header>
          {this.props.item.make}
        </Card.Header>
        <Card.Meta>
          Serial No.  {this.props.item.serialNo}
        </Card.Meta>
        <Card.Description>
        <Divider/>
        <List>
          {this.props.item.dynaData.map(data =>(
            <List.Item><Icon name="caret right"/> {data.name}:  {data.value}</List.Item>
          ))}
          {/* <List.Item><Icon name="caret right"/> Warranty End Date: {this.props.item.warrantyEndDate}</List.Item> */}
          
          <List.Item><Icon name="caret right"/> Purchase price: {this.props.item.purchasePrice}</List.Item>
          
        </List>
       
        </Card.Description>
          {(this.props.item.extras !== undefined) ?
          <div>
             <Divider/>
            <Card.Meta>Added Components</Card.Meta>
            <br />
            <Card.Description>
              <List>
                {this.props.item.extras.map( extra => (
                  <List.Item><Icon name="plus square outline"/> {extra.make} {extra.serialNo}</List.Item>
                ))}
              </List>
            </Card.Description>
            </div>
          :
          undefined
          }
      </Card.Content>
    
     
      <Card.Content extra>

      {(this.props.showButton) ? 
        <div>
          <Card.Meta textAlign="center">Assembly</Card.Meta>
          
          <div className='ui two buttons'>
            <Button onClick={this.props.selectForAssembly.bind(this, this.props.idx)}>
              <Icon name="setting"/>Add components
            </Button>
          </div>
        </div>
        : 
        undefined
        }     
      </Card.Content>

    </Card>
    )
  }
}
export default AssetCard

