import React from 'react'

class test extends React.Component {

  render() {
    return (
      <div class="parent">
      <h2>Multiple Line Ellipsis</h2>
      <div class="block-ellipsis">
          This is an example of a multi-line ellipsis. We just set the number of lines we want to display before the ellipsis takes into effect and make some changes to the CSS and the ellipsis should take into effect once we reach the number of lines we want.
        </div>
    </div>
    )
  }
}

export default test;
