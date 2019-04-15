import React,{Component} from 'react';
import { connect } from 'react-redux';
import TagCloud from 'react-tag-cloud';
import randomColor from 'randomcolor';

const styles = {
    large: {
      fontSize: 60,
      fontWeight: 'bold'
    },
    small: {
      opacity: 0.7,
      fontSize: 16
    }
  };

var paletteIndex = Math.floor(Math.random() * 685);

class Tagcloud extends Component{

      componentDidMount() {
        setInterval(() => {
          this.forceUpdate();
        }, 3000);
      }

    render(){

        var hashtags=[];
        for(let i=0; i<this.props.current_category.requests.length ;i++){
            for(let j=0; j<this.props.current_category.requests[i].hashtags.length; j++){
                hashtags.push(this.props.current_category.requests[i].hashtags[j])
            }
        }

        console.log(hashtags);

        return(
            <div className='app-outer'>
        <div className='app-inner'>
          <TagCloud 
            className='tag-cloud'
            rotate={() => Math.round(Math.random()) * 90}
            style={{
              fontFamily: 'sans-serif',
              fontSize: () => Math.round(Math.random() * 50) + 16,
              fontSize: 30,
              color: ()=>randomColor({
                hue: 'blue'
              }),
              padding: 5,
              height: "500px"
            }}>
            
              {hashtags.map(function(hashtag, index){
                  return(<span 
                        key={index+hashtag}
                        className={index%2==0 ? 'randomTag':null}>
                      <div>#{hashtag}</div>
                      </span>
                  )
              })}

          </TagCloud>
        </div>
      </div>
        )
    }
}

const mapStateToProps = (state) => ({
    current_category: state.currentCategory.current_category,
})

export default connect(mapStateToProps)(Tagcloud);