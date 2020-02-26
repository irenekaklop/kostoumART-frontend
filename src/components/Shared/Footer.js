import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import "../../components/Dashboard/Dashboard.css";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`,
  }
});

function Footer(props) {
  const { classes } = props;
  return (
    <div>
      <div id="Divider"></div>
      <div id="Footer">
        <span id="COPYRIGHT_2019___KOSTOUMART">COPYRIGHT 2019 | <a href="http://88.197.53.80/eirini/"> KOSTOUMART</a></span>
      </div>
    </div>
      
  
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);